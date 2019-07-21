const productController = require('../controllers/productController')

module.exports = (app, passport) => {

  app.get('/', (req, res) => res.redirect('/index'))
  app.get('/index', productController.getIndex)
  app.get('/Category/:category_id', productController.getCategoryProducts)
  app.get('/product/:id', productController.getProduct)
}