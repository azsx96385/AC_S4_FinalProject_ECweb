const express = require('express')
const router = express.Router()
//引用model套件
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const passport = require('../config/passport')
//Admin 後台 ==路由群組====================================================
let saleModel = require("./admin/saleModel");
let productModel = require("./admin/productModel");
let marketingModel = require("./admin/marketingModel");
//上傳圖片
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


//加入權限驗證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login')
}

// 後台權限驗證
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 1) {
      return next()
    }
    return res.redirect('/');
  }
  res.redirect('/users/login')
}

// 測試用function
// function authenticate(req, res, next) {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (!user) {
//       return res.redirect('/users/login')
//     }
//     req.user = user;
//     return next();
//   })(req, res, next);
// }

// function authenticateAdmin(req, res, next) {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (!user) {
//       return res.redirect('/users/login')
//     }

//     if (user.role === 1) {
//       req.user = user;
//       return next();
//     }
//     req.user = user;
//     return res.redirect('/');
//   })(req, res, next);
// }

// const authenticated = authenticate
// const authenticatedAdmin = authenticateAdmin



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
router.get("/", (req, res) => res.redirect("/index"));
// 首頁
router.get("/index", productController.getIndex);
// 搜尋功能
router.get("/ESHOP/search", productController.searchProduct);
// 分類產品頁面
router.get("/Category/:category_id", productController.getCategoryProducts);
// 單項產品頁面
router.get("/product/:id", productController.getProduct);
// 申請貨到通知
router.post("/product/:id/deliveryNotice", productController.postDeliveryNotice);
// 評價功能
router.post(
  "/product/:id/rate",
  authenticated,
  productController.postProductRate
);
// 刪除評價功能
router.delete(
  "/product/:id/rate/:id",
  authenticated,
  productController.deleteProductRate
);

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
//建立訂單
router.post('/order', authenticated, orderController.postOrder)
//訂單成立頁面
router.get('/order/:id/success', authenticated, orderController.getOrderSuccess)

//取消訂單
router.post('/order/:id', authenticated, orderController.cancelOrder)
//--------userprofile-----------------------------
//個人資料頁面與訂單詳情
router.get('/user/:id/profile', authenticated, userController.getUserProfile)

router.get('/user/:id/editProfile', authenticated, userController.getUserProfileEdit)
//編輯個人資料頁面
router.post('/user/:id/edit', authenticated, upload.single('image'), userController.postUserProfile)



//-------------coupon----------------------------

//----------使用coupon-------------------
router.post('/checkCoupon', authenticated, couponController.checkCoupon)
router.get('/couponOrder/:couponId', authenticated, couponController.getCouponOrderEdit)
//-----------adimin coupon manage---------------------
router.get('/admin/coupon/managePage', authenticated, couponController.getCouponManagePage)
router.get('/admin/coupon/managePage/:id/edit', authenticated, couponController.getCouponEditPage)
router.post('/admin/coupon/edit', authenticated, couponController.postCouponEdit)
//-----------製作coupon------------------
router.get('/admin/coupon/makingPage', authenticated, couponController.getCouponMakePage)
router.post('/admin/coupon/make', authenticated, couponController.postCouponMake)

//------------------------------------付款---------------------------------------------
//付款頁面
router.get("/order/:id/payment", authenticated, orderController.getPayment);
//callback
router.post(
  "/spgateway/callback",
  authenticated,
  orderController.spgatewayCallback
);

//------------------------------------超商取貨---------------------------------------------
//前往選取門市頁面
router.get(
  "/order/:id/branchselection",
  authenticated,
  orderController.getBranchSelection
);
//callback
router.post("/pickup/callback", authenticated, orderController.pickupCallback);
//[Admin 後台管理介面]=========================================================================================

//銷售模組router
router.use("/admin/salemodel", authenticatedAdmin, saleModel);
//產品模組router
router.use("/admin/productmodel", authenticatedAdmin, productModel);
//行銷模組router
router.use("/admin/marketingmodel", authenticatedAdmin, marketingModel);


// 管理貨到通知頁面
router.get("/admin/deliveryNotice", authenticatedAdmin, productController.getDeliveryNotice)
// 刪除貨到通知資料
router.delete('/admin/deliveryNotice/:id', authenticatedAdmin, productController.deleteDeliveryNotice)



module.exports = router