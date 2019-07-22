const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')




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


module.exports = router