const models = require('../models');

const Review = models.Review;

const addReview = (req, res) => {
  if (!req.body.spot || !req.body.rating || !req.body.reviewText) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const reviewData = {
    spot: req.body.spot,
    author: req.session.account._id,
    rating: req.body.rating,
    reviewText: req.body.reviewText,
  };

  const newReview = new Review.ReviewModel(reviewData);

  const reviewPromise = newReview.save();

  reviewPromise.then(() => res.status(201).json({ message: 'Review created successfully' }));

  reviewPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Review already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return reviewPromise;
};

const getReviews = (request, response) => {
  const req = request;
  const res = response;

  const query = {};
  if (req.query.author) {
    query.author = req.query.author;
  }
  if (req.query.spot) {
    query.spot = req.query.spot;
  }
  if (req.query.rating) {
    query.rating = req.query.rating;
  }

  return Review.ReviewModel.query(query, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ reviews: docs });
  });
};

module.exports.addReview = addReview;
module.exports.getReviews = getReviews;
