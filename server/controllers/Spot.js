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
  if (!req.body.name || !req.body.location || !req.body.description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const spotData = {
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    owner: req.session.account._id,
  };

  const newSpot = new Spot.SpotModel(spotData);

  const spotPromise = newSpot.save();

  spotPromise.then(() => res.json({ redirect: '/maker' }));

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

  return Spot.SpotModel.findQuery(req.query.location,
    req.query.name, req.query.description, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }

      return res.json({ spots: docs });
    });
};

const getProfileSpots = (request, response) => {
  const req = request;
  const res = response;

  return Spot.SpotModel.findByOwner(req.session.account._id, (err, docs) => {
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
module.exports.getProfileSpots = getProfileSpots;
