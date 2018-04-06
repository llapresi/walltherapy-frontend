const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// ;const _ = require('underscore');

let SpotModel = {};

const convertId = mongoose.Types.ObjectId;

const SpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

SpotSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  latitude: doc.latitude,
  location: doc.location,
});

SpotSchema.statics.findByOwner = (ownerId, callback, sortBy = 'createdData') => {
  const search = {
    owner: convertId(ownerId),
  };

  return SpotModel.find(search).select('name location description').sort(sortBy)
  .collation({ locale: 'en', strength: 2 })
  .exec(callback);
};

SpotSchema.statics.findQuery = (loc, name, description, callback, sortBy = 'createdData') => {
  const search = {
    location: new RegExp(loc, 'i'),
    name: new RegExp(name, 'i'),
    description: new RegExp(description, 'i'),
  };

  return SpotModel.find(search).select('name location description').sort(sortBy)
  .collation({ locale: 'en', strength: 2 })
  .exec(callback);
};

SpotSchema.statics.findByID = (id, callback, sortBy = 'createdData') => {
  const search = {
    _id: id,
  };

  return SpotModel.find(search).select('name location description').sort(sortBy)
  .collation({ locale: 'en', strength: 2 })
  .exec(callback);
};

SpotModel = mongoose.model('Spot', SpotSchema);
module.exports.SpotModel = SpotModel;
module.exports.SpotSchema = SpotSchema;
