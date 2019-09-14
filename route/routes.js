
const express = require('express')
const router = express.Router()
//引用model套件
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const passport = require('../config/passport')


//加入權限驗證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('XXXXXXXXXXXXXXXX', req.loginUser)
    console.log('XXXXXXXXXXXXXXXX', req.user)
    return next()
    // if (req.loginUser.role === 1) {
    //   return next()
    // }

  }
  res.redirect('/users/login')
}



//[使用者 登入 | 登出 | 註冊]==========================
router.get("/users/signUp", userController.signUpPage);
router.post("/users/signUp", userController.signUp);

router.get("/users/logIn", userController.logInPage);
router.post(
  "/users/logIn",
  passport.authenticate("local", {
    failureRedirect: "/users/logIn",
    failureFlash: true
  }),
  userController.logIn
);

//fb登入認證
//使用者登入fb取得授權
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/cart',
    failureRedirect: '/users/login',
  })
)

router.get("/users/logOut", userController.logOut);

//忘記密碼
router.get('/forget', userController.getForgetPasswordPage)
router.post('/forget', userController.postResetUrl)
router.get('/reset/:token', userController.getResetPage)
router.post('/reset/:token', userController.postResetPassword)

//-------------------商品瀏覽頁面-----------------------------------------
router.get('/', (req, res) => res.redirect('/index'))
router.get('/index', productController.getIndex)
router.get('/ESHOP/search', productController.searchProduct)
router.get('/Category/:category_id', productController.getCategoryProducts)
router.get('/product/:id', productController.getProduct)

//---------購物車-----------------------------------------------------------------------
//購物車頁面
router.get('/cart', cartController.getCart)
//加入購物車
router.post('/cart', cartController.postCart)
//購物車內 增加購買商品數量
router.post('/cartItem/:id/add', cartController.addCartItem)
//購物車內 減少購買商品數量
router.post('/cartItem/:id/sub', cartController.subCartItem)
//刪除購物車的商品
router.delete('/cartItem/:id', cartController.deleteCartItem)
//-------------------------------------------訂單--------------------------------------
//訂單編輯畫面
router.get('/orderEdit', authenticated, orderController.getOrderEdit)
//訂單成立
router.post('/order', authenticated, orderController.postOrder)
//個人資料頁面與訂單詳情
router.get('/user/:id/profile', authenticated, userController.getUserProfile)
//取消訂單
router.post('/order/:id', orderController.cancelOrder)
//-------------coupon----------------------------
//-----------製作coupon------------------
router.get('/coupon/makingPage', couponController.getCouponMakePage)
router.post('/coupon/make', couponController.postCouponMake)
//----------使用coupon-------------------
router.get('/enterCoupon', authenticated, couponController.enterCoupon)
router.post('/checkCoupon', couponController.checkCoupon)
///////////////////////////////
router.get('/couponOrder/:couponId', couponController.getCouponOrderEdit)




module.exports = router