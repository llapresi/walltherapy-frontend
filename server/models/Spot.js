const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// ;const _ = require('underscore');

let SpotModel = {};

const convertId = mongoose.Types.ObjectId;

const SpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  location: {
    type: [Number], // [<longitude>, <latitude>]
    index: '2d',
  },

  // Wall Thearpy Year this piece was part of
  year: {
    type: Number,
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

  // Artist is just name field right now, implement an actual artist object in the final
  artist: {
    type: String,
    required: true,
    trim: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  locationName: {
    type: String,
    trim: true,
  },
});

SpotSchema.statics.toAPI = doc => ({
  name: doc.name,
  location: doc.location,
  artist: doc.artist,
  year: doc.year,
  locationName: doc.locationName,
});

SpotSchema.statics.findByOwner = (ownerId, callback, sortBy = 'createdData') => {
  const search = {
    owner: convertId(ownerId),
  };

  return SpotModel.find(search).select('name location description _id artist year locationName').sort(sortBy)
    .collation({ locale: 'en', strength: 2 })
    .exec(callback);
};

SpotSchema.statics.query = (params, callback) => {
  // TODO: Add finding near location
  const search = {};
  if (params.owner) {
    search.owner = convertId(params.owner);
  }
  if (params.filter) {
    search.$or = [
      { name: { $regex: params.filter, $options: 'i' } },
      { description: { $regex: params.filter, $options: 'i' } },
    ];
  }
  if (params.name) {
    search.name = new RegExp(params.name, 'i');
  }
  if (params.description) {
    search.description = new RegExp(params.description, 'i');
  }
  if (params.artist) {
    search.artist = new RegExp(params.artist, 'i');
  }
  if (params._id) {
    search._id = params._id;
  }
  if (params.year) {
    search.year = params.year;
  }

  // Location stuff
  if (params.lng && params.lat) {
    search.location = {
      $near: [params.lng, params.lat],
    };
    if (params.dist) {
      const maxDistDeg = (params.dist / 6371) * (180 / Math.PI);
      search.location.$maxDistance = maxDistDeg;
    }
  }

  return SpotModel.find(search)
    .select('name location description artist year _id owner locationName')
    .collation({ locale: 'en', strength: 2 })
    .populate('owner', '-password -__v')
    .exec(callback);
};

SpotModel = mongoose.model('Spot', SpotSchema);
module.exports.SpotModel = SpotModel;
module.exports.SpotSchema = SpotSchema;
