let routes = require("./routes");
let apis = require("./apis");
let userController = require("../controllers/userController");
let productController = require("../controllers/productController");
let cartController = require("../controllers/cartController");
let orderController = require("../controllers/orderController");
// addmailsender 衝突
// module.exports = (app) => {
//   app.use('/', routes);
//   app.use('/api', apis)

module.exports = (app, passport) => {
  //加入權限驗證
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  };

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
};
