const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// ;const _ = require('underscore');

let ReviewModel = {};

const convertId = mongoose.Types.ObjectId;

const ReviewSchema = new mongoose.Schema({
  spot: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Spot',
  },

  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },

  reviewText: {
    type: String,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.statics.toAPI = (doc) => ({
  spot: doc.spot,
  author: doc.author,
  rating: doc.rating,
  reviewText: doc.reviewText,
  date: doc.createdData,
});

ReviewSchema.statics.query = (params, callback, sortBy = 'createdData') => {
  const search = params;
  if (params.author) {
    search.author = convertId(params.author);
  }
  if (params.spot) {
    search.spot = convertId(params.spot);
  }
  if (params.rating) {
    search.rating = params.rating;
  }

  return ReviewModel.find(search).select('spot author rating reviewText date').sort(sortBy)
  .collation({ locale: 'en', strength: 2 })
  .exec(callback);
};

ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports.ReviewModel = ReviewModel;
module.exports.ReviewSchema = ReviewSchema;
