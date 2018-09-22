const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/spots', controllers.Spot.getSpots);
  app.post('/spots', mid.requiresLogin, controllers.Spot.makeSpot);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresLogin, mid.requiresSecure,
    controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/app*', controllers.App.appPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/reviews', mid.requiresLogin, controllers.Review.addReview);
  app.get('/reviews', controllers.Review.getReviews);
  app.get('/getUsernameForId', mid.requiresLogin, controllers.Account.getUsernameForId);
};

module.exports = router;
