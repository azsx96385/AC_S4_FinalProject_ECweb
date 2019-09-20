let routes = require("./routes");
let apis = require("./apis");
let userController = require("../controllers/userController");
let productController = require("../controllers/productController");
let cartController = require("../controllers/cartController");
let orderController = require("../controllers/orderController");
//Admin 後台 ==路由群組====================================================
let saleModel = require("./admin/saleModel");
let productModel = require("./admin/productModel");
let marketingModel = require("./admin/marketingModel");

// addmailsender 衝突
/*module.exports = (app) => {
 app.use('/', routes);
app.use('/api', apis)*/

module.exports = (app, passport) => {
  app.use("/", routes);
  app.use("/api", apis);

  // 加入權限驗證
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
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

  //-------------------商品瀏覽頁面-----------------------------------------
  app.get("/", (req, res) => res.redirect("/index"));
  // 首頁
  app.get("/index", productController.getIndex);
  // 搜尋功能
  app.get("/ESHOP/search", productController.searchProduct);
  // 分類產品頁面
  app.get("/Category/:category_id", productController.getCategoryProducts);
  // 單項產品頁面
  app.get("/product/:id", productController.getProduct);
  // 申請貨到通知
  app.post("/product/:id/deliveryNotice", productController.postDeliveryNotice);
  // 評價功能
  app.post(
    "/product/:id/rate",
    authenticated,
    productController.postProductRate
  );
  // 刪除評價功能
  app.delete(
    "/product/:id/rate/:id",
    authenticated,
    productController.deleteProductRate
  );

  //---------購物車-----------------------------------------------------------------------
  //購物車頁面
  app.get("/cart", cartController.getCart);
  //加入購物車
  app.post("/cart", cartController.postCart);
  //購物車內 增加購買商品數量
  app.post("/cartItem/:id/add", cartController.addCartItem);
  //購物車內 減少購買商品數量
  app.post("/cartItem/:id/sub", cartController.subCartItem);
  //刪除購物車的商品
  app.delete("/cartItem/:id", cartController.deleteCartItem);

  //-------------------------------------------訂單--------------------------------------
  //訂單編輯畫面
  app.get("/orderEdit", authenticated, orderController.getOrderEdit);
  //訂單成立
  app.post("/order", authenticated, orderController.postOrder);
  //個人資料頁面與訂單詳情
  app.get("/user/:id/profile", authenticated, userController.getUserProfile);
  //刪除訂單
  //app.delete("/order/:id", orderController.deleteOrder);

  //------------------------------------付款---------------------------------------------
  //付款頁面
  app.get("/order/:id/payment", authenticated, orderController.getPayment);
  //callback
  app.post(
    "/spgateway/callback",
    authenticated,
    orderController.spgatewayCallback
  );

  //------------------------------------超商取貨---------------------------------------------
  //前往選取門市頁面
  app.get(
    "/order/:id/branchselection",
    authenticated,
    orderController.getBranchSelection
  );
  //callback
  app.post("/pickup/callback", authenticated, orderController.pickupCallback);
  //[Admin 後台管理介面]=========================================================================================

  //銷售模組router
  app.use("/admin/salemodel", authenticatedAdmin, saleModel);
  //產品模組router
  app.use("/admin/productmodel", authenticatedAdmin, productModel);
  //行銷模組router
  app.use("/admin/marketingmodel", authenticatedAdmin, marketingModel);



  // 管理貨到通知頁面
  app.get("/admin/deliveryNotice", authenticatedAdmin, productController.getDeliveryNotice)
  // 刪除貨到通知資料
  app.delete('/admin/deliveryNotice/:id', authenticatedAdmin, productController.deleteDeliveryNotice)
};
