const productController = require('../controllers/productController')

module.exports = (app, passport) => {

  app.get('/', (req, res) => res.redirect('/index'));
  app.get('/index', productController.getIndex);

}