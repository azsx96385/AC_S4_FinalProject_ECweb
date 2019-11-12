//引入套件區
const bcrypt = require("bcryptjs");
const db = require("../../models");
const User = db.User;
const userService = require('../../services/userService')
//-------------------- JWT----------------------------------------------
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const userController = {
  signUp: (req, res) => {
    let { name, email, password, password_confirm } = req.body;

    //驗證資料缺漏
    if (!email || !name || !password || !password_confirm) {
      return res.json({ status: 'error', message: '錯誤訊息|資料漏填' })
    }
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        return res.json({ status: 'error', message: '錯誤訊息|帳號已被使用' })
      } else {
        if (password == password_confirm) {
          //通過-寫入資料庫
          password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          );
          User.create({ email, name, password }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          });
        } else {
          //驗證失敗
          return res.json({ status: 'error', message: '錯誤訊息|密碼輸入不相同' })
        }
      }
    });
    //驗證密碼相同
  },

  logInPage: (req, res) => {
    userService.logInPage(req, res, (data) => {
      res.json(data);
    })
  },

  logIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: "error",
        message: "required fields didn't exist"
      });
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: username } }).then(user => {
      if (!user)
        return res
          .status(401)
          .json({ status: "error", message: "no such user found" });
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: "error", message: "passwords did not match" });
      }
      // 簽發 token
      var payload = { id: user.id };
      var token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.json({
        status: "success",
        message: "ok",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  },

  getUserProfile: (req, res) => {
    userService.getUserProfile(req, res, (data) => {
      res.json(data);
    })
  },

  getUserProfileEdit: (req, res) => {
    userService.getUserProfileEdit(req, res, (data) => {
      res.json(data);
    })
  },

  postUserProfile: (req, res) => {
    userService.postUserProfile(req, res, (data) => {
      res.json(data);
    })
  },

  getForgetPasswordPage: (req, res) => {
    userService.getForgetPasswordPage(req, res, (data) => {
      res.json(data);
    })
  },

  postResetUrl: async (req, res) => {
    userService.postResetUrl(req, res, (data) => {
      res.json(data);
    })
  },

  getResetPage: async (req, res) => {
    userService.getResetPage(req, res, (data) => {
      res.json(data);
    })
  },

  postResetPassword: (req, res) => {
    userService.postResetPassword(req, res, (data) => {
      res.json(data);
    })
  }
};

module.exports = userController;
