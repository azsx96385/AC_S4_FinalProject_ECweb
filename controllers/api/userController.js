//引入套件區
const bcrypt = require("bcryptjs");
const db = require("../../models");
const User = db.User;
//-------------------- JWT----------------------------------------------
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const userController = {
  //[使用者 登入 | 登出 | 註冊]
  // signUpPage: (req, res) => {
  //   return res.render("user_signIn");
  // },
  // signUp: (req, res) => {
  //   let { name, email, password, password_confirm } = req.body;

  //   //驗證資料缺漏
  //   if (!email || !name || !password || !password_confirm) {
  //     console.log("錯誤訊息|資料漏填");
  //     req.flash("error_messages", "錯誤訊息|資料漏填");
  //     return res.redirect("back");
  //   }
  //   User.findOne({ where: { email: email } }).then(user => {
  //     if (user) {
  //       req.flash("error_messages", "錯誤訊息|帳號已被使用");
  //       return res.redirect("back");
  //     } else {
  //       if (password == password_confirm) {
  //         //通過-寫入資料庫
  //         password = bcrypt.hashSync(
  //           req.body.password,
  //           bcrypt.genSaltSync(10),
  //           null
  //         );
  //         User.create({ email, name, password }).then(user => {
  //           return res.redirect("/users/logIn");
  //         });
  //       } else {
  //         //驗證失敗
  //         console.log("錯誤訊息|密碼輸入不相同");
  //         req.flash("error_messages", "錯誤訊息|密碼輸入不相同");
  //         return res.redirect("back");
  //       }
  //     }
  //   });
  //   //驗證密碼相同
  // },
  // logInPage: (req, res) => {
  //   return res.render("user_login");
  // },
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

  // logOut: (req, res) => {
  //   req.flash("success_messages", "成功訊息|你已經成功登出");
  //   req.logout();
  //   res.redirect("/users/logIn");
  // }
};
module.exports = userController;
