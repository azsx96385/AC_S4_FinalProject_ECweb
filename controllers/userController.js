//引入套件區
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;

//-------------------- JWT----------------------------------------------
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

//---------忘記密碼---------------------
var crypto = require("crypto-js");

const userService = require('../services/userService.js')

const userController = {
  //[使用者 登入 | 登出 | 註冊]
  signUpPage: (req, res) => {
    return res.render("user_signIn");
  },

  signUp: (req, res) => {
    let { name, email, password, password_confirm } = req.body;

    //驗證資料缺漏
    if (!email || !name || !password || !password_confirm) {
      console.log("錯誤訊息|資料漏填");
      req.flash("error_messages", "錯誤訊息|資料漏填");
      return res.redirect("back");
    }
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        req.flash("error_messages", "錯誤訊息|帳號已被使用");
        return res.redirect("back");
      } else {
        if (password == password_confirm) {
          //通過-寫入資料庫
          password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          );
          User.create({ email, name, password }).then(user => {
            return res.redirect("/users/logIn");
          });
        } else {
          //驗證失敗
          console.log("錯誤訊息|密碼輸入不相同");
          req.flash("error_messages", "錯誤訊息|密碼輸入不相同");
          return res.redirect("back");
        }
      }
    });
    //驗證密碼相同
  },

  logInPage: (req, res) => {
    userService.logInPage(req, res, (data) => {
      return res.render("user_login", data);
    })
  },

  logIn: (req, res) => {
    //使用 passport 做驗證

    let redirectUrl = req.body.redirectUrl;
    if (redirectUrl) {
      return res.redirect(redirectUrl);
    } else {
      req.flash("success_messages", "成功訊息|你已經成功登入");
      return res.redirect("/index");
    }
  },

  logOut: (req, res) => {
    req.flash("success_messages", "成功訊息|你已經成功登出");
    req.logout();
    res.redirect("/users/logIn");
  },

  getUserProfile: (req, res) => {
    userService.getUserProfile(req, res, (data) => {
      return res.render("userProfile", data);
    })
  },

  getUserProfileEdit: (req, res) => {
    userService.getUserProfileEdit(req, res, (data) => {
      return res.render("userProfileEdit", data);
    })
  },

  postUserProfile: (req, res) => {
    userService.postUserProfile(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
      }
      return res.redirect(`/user/${req.params.id}/profile`);
    })
  },

  //-------reset password------------------
  getForgetPasswordPage: (req, res) => {
    userService.getForgetPasswordPage(req, res, (data) => {
      res.render("forgetPasswordPage", data);
    })
  },

  postResetUrl: async (req, res) => {
    userService.postResetUrl(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect("/forget");
      }
    })
    req.flash('success_messages', data['message'])
    return res.redirect(`/forget`);
  },

  getResetPage: async (req, res) => {
    userService.getResetPage(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect("/forget");
      }
      res.render("reset", data);
    })
  },

  postResetPassword: (req, res) => {
    userService.postResetPassword(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect("back");
      }
      return res.redirect("/users/logIn");
    })
  }
};
module.exports = userController;
