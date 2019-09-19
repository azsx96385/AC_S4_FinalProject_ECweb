//引入lin & strategy &model
const passport = require("passport");
const localStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const bcrypt = require("bcryptjs");

//model
const db = require("../models");
const User = db.User;

// JWT
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
//--------------JWT 策略-----------------------
require('dotenv').config()
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

//passport-local 策略設定--------------------------------
passport.use(
  new localStrategy(
    {
      //設定驗證帳密
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      //啟動登入驗證流程
      User.findOne({ where: { email: username } }).then(user => {
        ///使用者不存在-驗證失敗
        if (!user) {
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息|帳號尚未註冊")
          );
        }
        //查有使用者-比對密碼是否正確|密碼不一致-驗證失敗
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息|密碼輸入錯誤")
          );
        } else {
          //密碼正確-驗證通過-回傳user物件
          return cb(null, user);
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ["email", "displayName"]
    },
    (accessToken, refreshToken, profile, done) => {
      // find and create user
      User.findOne({
        email: profile._json.email
      }).then(user => {
        // 如果 email 不存在就建立新的使用者
        if (!user) {
          // 因為密碼是必填欄位，所以我們可以幫使用者隨機產生一組密碼，然後用 bcrypt 處理，再儲存起來
          var randomPassword = Math.random()
            .toString(36)
            .slice(-8);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              var newUser = User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              });
              newUser
                .save()
                .then(user => {
                  return done(null, user);
                })
                .catch(err => {
                  console.log(err);
                });
            })
          );
        } else {
          return done(null, user);
        }
      });
    }
  )
);



//passport 正反序列---------------------------------------------------------
passport.serializeUser((user, cb) => {
  cb(null, user.id); //驗證通過-接住user物件，取出user-id 存到session
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user);
  });
});

// JWT
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
//--------------JWT 策略-----------------------
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [{ model: db.Comment }, { model: db.Order }]
  }).then(user => {
    if (!user) return next(null, false);
    return next(null, user);
  });
});
passport.use(strategy);

//匯出passport
module.exports = passport;
