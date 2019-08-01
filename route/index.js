
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
  //-------jwt登入------------------------------//
  app.post('/users/logIn', userController.logIn)
  //fb登入認證
  //使用者登入fb取得授權
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  )

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/orderEdit',
      failureRedirect: '/users/login',
    })
  )

  app.get("/users/logOut", userController.logOut);

  //-------------------商品瀏覽頁面-----------------------------------------
  app.get('/', (req, res) => res.redirect('/index'))
  app.get('/index', productController.getIndex)
  app.get('/ESHOP/search', productController.searchProduct)
  app.get('/Category/:category_id', productController.getCategoryProducts)
  app.get('/product/:id', productController.getProduct)

  //---------購物車-----------------------------------------------------------------------
  //購物車頁面
  app.get('/cart', cartController.getCart)
  //加入購物車
  app.post('/cart', cartController.postCart)
  //購物車內 增加購買商品數量
  app.post('/cartItem/:id/add', cartController.addCartItem)
  //購物車內 減少購買商品數量
  app.post('/cartItem/:id/sub', cartController.subCartItem)
  //刪除購物車的商品
  app.delete('/cartItem/:id', cartController.deleteCartItem)
  //-------------------------------------------訂單--------------------------------------
  //訂單編輯畫面
  app.get('/orderEdit', authenticated, orderController.getOrderEdit)
  //訂單成立
  app.post('/order', authenticated, orderController.postOrder)
  //個人資料頁面與訂單詳情
  app.get('/user/:id/profile', authenticated, userController.getUserProfile)
  //取消訂單
  app.post('/order/:id', orderController.cancelOrder)
}