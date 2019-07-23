const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')




//加入權限驗證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}


//[使用者 登入 | 登出 | 註冊]==========================
router.get("/", (req, res) => {
  res.redirect("/users/logIn");
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



module.exports = router