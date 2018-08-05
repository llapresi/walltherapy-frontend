const models = require('../models');

const Spot = models.Spot;

const makerPage = (req, res) => {
  Spot.SpotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An account occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), spots: docs });
  });
};

const makeSpot = (req, res) => {
  if (!req.body.name || !req.body.longitude || !req.body.latitude || !req.body.description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const spotData = {
    name: req.body.name,
    location: [req.body.longitude, req.body.latitude],
    description: req.body.description,
    isSponsored: req.body.isSponsored,
    owner: req.session.account._id,
  };

  const newSpot = new Spot.SpotModel(spotData);

  const spotPromise = newSpot.save();

  spotPromise.then(() => res.status(201).json({ message: 'Skate spot created' }));

  spotPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Spot already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return spotPromise;
};

const getSpots = (request, response) => {
  const req = request;
  const res = response;

  const query = {};
  if (req.query.owner) {
    query.owner = req.query.owner;
  }
  if (req.query.name) {
    query.name = req.query.name;
  }
  if (req.query.description) {
    query.description = req.query.description;
  }
  if (req.query.filter) {
    query.filter = req.query.filter;
  }
  if (req.query.profileSpots) {
    query.owner = req.session.account._id;
  }

  return Spot.SpotModel.query(query, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ spots: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.makeSpot = makeSpot;
module.exports.getSpots = getSpots;
