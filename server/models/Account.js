const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 12;

mongoose.Promise = global.Promise;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return bcrypt.compare(password, pass, (err, res) => callback(res));
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.getUsernameForId = (_id, callback) => {
  const search = {
    _id,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.method('compareHash', function compareHash(plaintextToCheck) {
  return bcrypt.compare(plaintextToCheck, this.password);
});

AccountSchema.statics.generateHash = (password, callback) => {
  // Bcrypt.hash auto generates salt, you only need to store hash in model
  bcrypt.hash(password, saltRounds, (err, hash) => {
    callback(hash);
  });
};

AccountSchema.statics.authenticate = (username, password, callback) => AccountModel.findByUsername(
  username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  },
);

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
