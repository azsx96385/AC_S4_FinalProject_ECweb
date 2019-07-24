const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')




//加入權限驗證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}


//[使用者 登入 | 登出 | 註冊]==========================
router.get("/", (req, res) => {
  res.redirect("/products");
});
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

router.get("/users/logOut", userController.logOut);

//商品頁面
router.get('/products', productController.getProducts)
//---------購物車-----------------------------------------------------------------------//
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
//-------------------------------------------訂單--------------------------------------//
//訂單編輯畫面
router.get('/orderEdit', authenticated, orderController.getOrderEdit)
//訂單成立
router.post('/order', orderController.postOrder)
//個人資料頁面與訂單詳情
router.get('/user/:id/profile', authenticated, userController.getUserProfile)
//刪除訂單
router.delete('/order/:id', OrderController.deleteOrder)
module.exports = router