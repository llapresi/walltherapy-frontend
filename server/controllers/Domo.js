const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An account occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favFood) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favFood: req.body.favFood,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getQuerySort = (req) => {
  switch (req.query.sort) {
    case 'dateAscending':
      return 'createdData';
    case 'dateDescending':
      return '-createdData';
    case 'nameAscending':
      return 'name';
    case 'nameDescending':
      return '-name';
    case 'ageAscending':
      return 'age';
    case 'ageDescending':
      return '-age';
    case 'foodAscending':
      return 'favFood';
    case 'foodDescending':
      return '-favFood';
    default:
      return 'createdData';
  }
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  }, getQuerySort(req));
};

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
module.exports.getDomos = getDomos;
