
//引用model套件
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

module.exports = (app, passport) => {

  //加入權限驗證
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  }


  //[使用者 登入 | 登出 | 註冊]==========================
  app.get("/users/signUp", userController.signUpPage);
  app.post("/users/signUp", userController.signUp);

  app.get("/users/logIn", userController.logInPage);
  app.post(
    "/users/logIn",
    passport.authenticate("local", {
      failureRedirect: "/users/logIn",
      failureFlash: true
    }),
    userController.logIn
  );
  app.get("/users/logOut", userController.logOut);


  app.get('/', (req, res) => res.redirect('/index'))
  app.get('/index', authenticated, productController.getIndex)
  app.get('/ESHOP/search', productController.searchProduct)
  app.get('/Category/:category_id', productController.getCategoryProducts)
  app.get('/product/:id', productController.getProduct)
}