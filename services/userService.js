//引入套件區
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const OrderItem = db.Order_item;
const Product = db.Product;
const OrderStatus = db.Order_status;
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
const Shipment_convenienceStore = db.Shipment_convenienceStore;
//---------忘記密碼---------------------
var crypto = require("crypto-js");
/*---------------nodmailer寄信----------------------*/
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID, // ClientID
  process.env.GMAIL_CLIENT_SECRET, // Client Secret
  process.env.GOOGLE_REDIRECT_URL // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: process.env.AUTH_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "vuvu0130@gmail.com",
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
    accessToken: accessToken
  }
});

const imgur = require('imgur-node-api');
const { IMGUR_CLIENT_ID } = process.env;

const userService = {
  logInPage: (req, res, callback) => {
    let redirectUrl = req.query.redirect;
    return callback({ redirectUrl });
  },

  getUserProfile: (req, res, callback) => {
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
            {
              model: Shipment_convenienceStore,
              as: "ShipmentConvenienceStore"
            },
            { model: OrderStatus }
          ]
        }
      ]
    }).then(user => {
      //找出user 在從user中找到order 在從order中找到產品
      let orderInfo = user.Orders.sort((a, b) => b.id - a.id);
      callback({ profile: user, orderInfo });
    });
  },

  getUserProfileEdit: (req, res, callback) => {
    if (Number(req.user.id) !== Number(req.params.id)) {
      return res.redirect('/');
    }
    return User.findByPk(req.params.id).then(user => {
      callback({ user });
    });
  },

  postUserProfile: (req, res, callback) => {
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            image: file ? img.data.link : user.image
          }).then(() => {
            return callback({ status: 'success', message: '個人資料已成功修改' })
          })
        });
      });
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          image: user.image
        }).then(() => {
          return callback({ status: 'success', message: '個人資料已成功修改' })
        })
      });
    }
  },

  getForgetPasswordPage: (req, res, callback) => {
    callback();
  },

  postResetUrl: async (req, res, callback) => {
    //除錯 未填email
    if (!req.body.email) {
      return callback({ status: 'error', message: "你尚未輸入信箱" })
    }
    //生成token
    let token = await Math.random().toString(36).substring(7)
    //審核user是否存在
    let user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return callback({ status: 'error', message: "你的信箱並不存在" })
    }

    await user.update({
      //在user上加入token
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000 // 1 hour
    })

    user.save(function (err) {
      done(err, token, user);
    });

    var mailOptions = {
      from: 'vuvu0130@gmail.com',
      to: req.body.email,

      subject: `密碼重設`,
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" +
        req.headers.host +
        "/reset/" +
        token +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n"
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
    return callback({ status: 'success', message: "已寄驗證信" })
  },

  getResetPage: async (req, res, callback) => {
    let user = User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      }
    });

    if (!user) {
      return callback({ status: 'error', message: "Password reset token is invalid or has expired." })
    }

    callback({
      user: req.user,
      token: req.params.token
    });
  },

  postResetPassword: (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(async user => {

      if (!user) {
        return callback({ status: 'error', message: "Password reset token is invalid or has expired." })
      }

      if (req.body.password == req.body.password_confirm) {
        //通過-寫入資料庫
        let originPassword = req.body.password;
        let hashedPassword = bcrypt.hashSync(
          originPassword,
          bcrypt.genSaltSync(10),
          null
        );

        await user.update({
          //在user上加入token
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined
        })

        user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user);
          });
        });

        return callback({ status: 'success', message: "" })
      }
    });
  }
}

module.exports = userService;