//引入套件區
//const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const OrderItem = db.Order_item;
const Product = db.Product;
//-------------------- JWT----------------------------------------------
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
/*---------------------處理payment跟shipment------------------------------*/
const Payment = db.Payment;
const Shipment = db.Shipment;
const ShipmentType = db.Shipment_type;
const PaymentType = db.Payment_type;
const ShipmentStatus = db.Shipment_status;
const PaymentStatus = db.Payment_status;

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
    res.redirect("/");
  },

  logOut: (req, res) => {
    req.flash("success_messages", "成功訊息|你已經成功登出");
    req.logout();
    res.redirect("/users/logIn");
  },
  getUserProfile: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          include: [
            { model: Product, as: "items", include: [OrderItem] },
            { model: ShipmentType, as: "ShipmentType" },
            { model: PaymentType, as: "PaymentType" },
            { model: ShipmentStatus, as: "ShipmentStatus" },
            { model: PaymentStatus, as: "PaymentStatus" }
          ]
        }
      ]
    }).then(user => {
      //找出user 在從user中找到order 在從order中找到產品
      let orderInfo = user.Orders.sort((a, b) => b.id - a.id); //由id來排先後???為何createAT不管用

      //找出payment shipment的 status與type
      console.log(orderInfo[0].ShipmentStatus[0].dataValues.shipmentStatus);

      return res.render("userProfile", {
        user,
        orderInfo
      });
    });
  }
};
module.exports = userController;
