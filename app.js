//[匯入套件 / lib設定]----------------------------------------------------------------------------
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
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

// cors 的預設為全開放
const cors = require('cors')
app.use(cors())

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
app.use(bdParser.json());

// 靜態檔案設定
app.use(express.static("public")); //如果要請求靜態檔案-直接到 public找
// app.use("/upload", express.static(__dirname + "/upload")); //如果請求路徑包括 /upload  那就到 /upload找

//session and cookie_parser
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
  session({
    secret: "ac",
    name: "ac",
    cookie: { maxAge: 25952000000 },
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());
//passport
const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//overwrite
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//[路由區]-------------------------------------------------------------------------------

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.loginUser = req.user;
  res.locals.localcartItem = req.session.cartItemNum;
  //GA追蹤碼
  const db = require("./models");
  const User = db.Store;
  User.findByPk(1).then(storeData => {
    res.locals.trackCodeGA = storeData.trackGA;
  });

  next();
});

require("./route")(app);
module.exports = app;
