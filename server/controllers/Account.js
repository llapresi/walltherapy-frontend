const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ status: 'logged out' });
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/app' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (hash) => {
    const accountData = {
      username: req.body.username,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/app' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.authenticate(req.session.account.username,
    req.body.oldPass, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Old password does not match' });
      }

      return Account.AccountModel.generateHash(req.body.pass, (hash) => {
        const newData = {
          password: hash,
        };

        const query = {
          _id: req.session.account._id,
        };

        Account.AccountModel.findOneAndUpdate(query, newData, { upsert: true }, (err2) => {
          if (err2) {
            return res.send(400, { error: err });
          }
          return res.status(200).json({ message: 'succesfully changed password' });
        });
      });
    });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const getUsernameForId = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.getUsernameForId(req.query.id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ username: docs.username });
  });
};

const isUserAuthed = (request, response) => {
  const req = request;
  const res = response;

  if (!req.session.account) {
    return res.json({ message: 'user not currently authed' });
  }
  return res.json({ account: req.session.account });
};

module.exports.loginPage = loginPage;
module.exports.logout = logout;
module.exports.login = login;
module.exports.signup = signup;
module.exports.isUserAuthed = isUserAuthed;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
module.exports.getUsernameForId = getUsernameForId;
