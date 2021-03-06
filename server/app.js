const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/Skatespotio_BCrypt';

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to mongo db');
    throw err;
  }
});

let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

let sessionSecret = 'So here I am...';
if (process.env.COOKIE_SECRET) {
  sessionSecret = process.env.COOKIE_SECRET;
}

const app = express();
app.use(compression());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use('/app', express.static(path.resolve(`${__dirname}/../dist/`)));

app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionId',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.use(cookieParser());
app.disable('x-powered-by');

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log(err.code);
  console.log('Missing CSRF Token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on port ${port}`);
});
