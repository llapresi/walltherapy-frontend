const models = require('../models');

const { Spot } = models;

const makeSpot = (req, res) => {
  if (!req.body.name || !req.body.longitude || !req.body.latitude
    || !req.body.description || !req.body.artist) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const spotData = {
    name: req.body.name,
    location: [req.body.longitude, req.body.latitude],
    description: req.body.description,
    artist: req.body.artist,
    owner: req.session.account._id,
    year: req.body.year,
    locationName: req.body.locationName,
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

  const { query } = req;
  /* Only change these ones in the controller because the other URL params besides the ones below
   should be the same name as the model props */
  if (req.query.profileSpots) {
    query.owner = req.session.account._id;
  }
  if (req.query.id) {
    query._id = req.query.id;
  }

  return Spot.SpotModel.query(query, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ spots: docs });
  });
};

module.exports.makeSpot = makeSpot;
module.exports.getSpots = getSpots;
