//[匯入套件 / lib設定]----------------------------------------------------------------------------
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./models");
const flash = require("connect-flash");
app.listen(port, () => {
  db.sequelize.sync();
  console.log(`Example app listening on port ${port}!`);
  console.log("目前環境為", process.env.NODE_ENV);
});
// 判別開發環境
if (process.env.NODE_ENV !== "production") {
  // 如果不是 production 模式
  require("dotenv").config(); // 使用 dotenv 讀取 .env 檔案
}

//handlebars |view
const handlebars = require("express-handlebars");
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helper")
  })
);
app.set("view engine", "handlebars");

//bodyparser
const bdParser = require("body-parser");
app.use(bdParser.urlencoded({ extended: true }));

// //靜態檔案設定
app.use(express.static("public"));
app.use("/upload", express.static(__dirname + "/upload"));

//session
const session = require("express-session");
app.use(
  session({ secret: "seceret", resave: false, saveUninitialized: false })
);
app.use(flash());
//passport
const passport = require("passport");
//const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
//overwrite
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//[路由區]-------------------------------------------------------------------------------

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  // res.locals.isAuthenticated =
  // res.locals.adminAuthenticate =
  next();
});

require("./route/water_index")(app);
module.exports = app;
