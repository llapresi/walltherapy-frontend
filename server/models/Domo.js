const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setFood = (name) => _.escape(name).trim();


const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    required: true,
    min: 0,
  },

  favFood: {
    type: String,
    required: true,
    trim: true,
    set: setFood,
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

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  favFood: doc.age.favFood,
});

DomoSchema.statics.findByOwner = (ownerId, callback, sortBy = 'createdData') => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age favFood').sort(sortBy)
  .collation({ locale: 'en', strength: 2 })
  .exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
