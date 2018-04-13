const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSpots', mid.requiresLogin, controllers.Spot.getSpots);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresLogin, mid.requiresSecure,
    controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Spot.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Spot.makeSpot);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/addReview', mid.requiresLogin, controllers.Review.addReview);
  app.get('/getReviews', mid.requiresLogin, controllers.Review.getReviews);
  app.get('/getUsernameForId', mid.requiresLogin, controllers.Account.getUsernameForId);
};

module.exports = router;
