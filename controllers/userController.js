
//引入套件區
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User
const Order = db.Order
const orderItem = db.order_item
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
    return res.render("user_login");
  },
  logIn: (req, res) => {
    //使用 passport 做驗證
    req.flash("success_messages", "成功訊息|你已經成功登入");
    res.redirect("/orderEdit");
  },
  logOut: (req, res) => {
    req.flash("success_messages", "成功訊息|你已經成功登出");
    req.logout();
    res.redirect("/users/logIn");
  },
  getUserProfile: (req, res) => {

  }
}
module.exports = userController