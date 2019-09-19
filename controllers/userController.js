//引入套件區
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const OrderItem = db.Order_item;
const Product = db.Product;
const OrderStatus = db.Order_status
const fs = require('fs')
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
const Shipment_convenienceStore = db.Shipment_convenienceStore
//---------忘記密碼---------------------
var crypto = require('crypto-js');
/*---------------nodmailer寄信----------------------*/
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID, // ClientID
  process.env.GMAIL_CLIENT_SECRET, // Client Secret
  process.env.GOOGLE_REDIRECT_URL, // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: process.env.AUTH_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()


const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: 'vuvu0130@gmail.com',
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
    accessToken: accessToken
  }
});

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
    let redirectUrl = req.query.redirect


    return res.render("user_login", { redirectUrl });
  },
  logIn: (req, res) => {
    //使用 passport 做驗證
    req.flash("success_messages", "成功訊息|你已經成功登入");

    let redirectUrl = req.body.redirectUrl
    if (redirectUrl) {
      res.redirect(redirectUrl);
    }
    else { res.redirect('/index') }

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
            { model: PaymentStatus, as: "PaymentStatus" },
            { model: Shipment_convenienceStore, as: "ShipmentConvenienceStore" },
            { model: OrderStatus }
          ]
        }
      ]
    }).then(user => {
      //找出user 在從user中找到order 在從order中找到產品
      let orderInfo = user.Orders.sort((a, b) => b.id - a.id);

      return res.render("userProfile", {
        user,
        orderInfo
      });
    });
  },
  getUserProfileEdit: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('userProfileEdit', { user })
    })
  },
  postUserProfile: (req, res) => {
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id).then(user => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              address: req.body.address,
              password: req.body.password,
              image: file ? `/upload/${file.originalname}` : user.image
            })

            res.redirect(`/user/${req.params.id}/profile`)
          })
        })
      })
    }
    else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          password: req.body.password,
        })

        res.redirect(`/user/${req.params.id}/profile`)
      })
    }
  },
  //-------reset password------------------
  getForgetPasswordPage: (req, res) => {
    res.render('forgetPasswordPage')
  },
  postResetUrl: async (req, res) => {
    //除錯 未填email
    if (!req.body.email) {
      req.flash("error_messages", '你尚未輸入信箱!!');
      return res.redirect('/forget');
    }
    //生成token
    let token = Math.random().toString(36).substring(7)

    //審核user是否存在
    let user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
      req.flash("error_messages", '你的信箱並不存在');
      return res.redirect('/forget');
    }
    //在user上加入token
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    user.save(function (err) {
      done(err, token, user);
    });

    var mailOptions = {
      from: 'vuvu0130@gmail.com',
      to: 'vuvu0130@gmail.com',
      subject: `密碼重設`,
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
    req.flash("success_messages", '已寄驗證信');
    return res.redirect(`/forget`)
  },

  getResetPage: async (req, res) => {
    let user = User.findOne({ where: { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } } })
    if (!user) {
      req.flash('error_messages', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user,
      token: req.params.token
    });

  },
  postResetPassword: (req, res) => {

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
      if (!user) {
        req.flash('error_messages', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
      }
      if (req.body.password == req.body.password_confirm) {
        //通過-寫入資料庫
        let originPassword = req.body.password
        let hashedPassword = bcrypt.hashSync(
          originPassword,
          bcrypt.genSaltSync(10),
          null
        );


        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        console.log(user)
        user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user);
          });
        });
        req.flash('')
        return res.redirect('/users/logIn')
      }
    })
  },

};
module.exports = userController;
