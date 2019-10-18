const db = require("../models");
const Cart = db.Cart;
const CartItem = db.Cart_item;
const Product = db.Product;
const User = db.User;
const Order = db.Order;
const OrderItem = db.Order_item;
const Order_status = db.Order_status
/*---------------------處理payment跟shipment------------------------------*/
const Payment = db.Payment;
const Shipment = db.Shipment;
const ShipmentType = db.Shipment_type;
const PaymentType = db.Payment_type;
const ShipmentStatus = db.Shipment_status;
const PaymentStatus = db.Payment_status;
const Shipment_convenienceStore = db.Shipment_convenienceStore
const getTradeInfo = require("../public/javascript/getTradeInfo");
const decryptTradeInfo = require("../public/javascript/decryptTradeInfo");
const getPickupInfo = require("../public/javascript/getPickupInfo")
//------coupon-------
const Coupon = db.Coupon;
const CouponsUsers = db.CouponsUsers;

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

const orderController = {
  getOrderEdit: (req, res) => {
    return Cart.findByPk(req.session.cartId, {
      include: [{ model: Product, as: "items", include: [CartItem] }]
    }).then(cart => {
      cart = cart || { items: [] };

      let totalPrice =
        cart.items.length > 0
          ? cart.items
            .map(d => d.price * d.Cart_item.quantity)
            .reduce((a, b) => a + b)
          : 0; //如果cart-item沒東西，則為0

      //運費判斷
      let shippingFee = 60
      let subtotal = 0
      if (totalPrice < 999) {
        subtotal = totalPrice + shippingFee
      } else {
        subtotal = totalPrice
        shippingFee = 0
      }

      return User.findByPk(req.user.id).then(user => {
        return res.render("orderEdit", {
          cart,
          totalPrice,
          user,
          subtotal,
          shippingFee
        });
      });
    });
  },
  postOrder: async (req, res) => {
    //COUPON
    if (req.body.couponId) {
      let coupon = await Coupon.findByPk(req.body.couponId)
      let totalPrice = Number(req.body.amount)
      let discountTotalPrice = Number(req.body.amount - coupon.discount)
      //運費判斷
      if (totalPrice < 999) {
        discountTotalPrice += 60
      }
      var discount = coupon.discount
      var subtotal = discountTotalPrice
      CouponsUsers.findOrCreate({
        where: {
          UserId: req.user.id,
          CouponId: coupon.id
        }
      }).spread((couponUser, created) => {
        couponUser.update({
          counts: (couponUser.counts || 0) + 1
        });
      })

    } else {
      let totalPrice = Number(req.body.amount);
      //運費判斷
      if (totalPrice < 999) {
        totalPrice += 60
      }
      var discount = 0
      var subtotal = totalPrice
    }

    return Cart.findByPk(req.body.cartId, {
      include: [{ model: Product, as: "items", include: [CartItem] }]
    }).then(cart => {
      //建立order

      return Order.create({
        UserId: req.user.id,
        StoreId: req.body.StoreId,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        amount: subtotal,
        OrderStatusId: 1
        //還要處理payment跟shipment
      })
        .then(order => {
          //建立order_item
          cart.items.forEach(item => {
            //從購物車中的item移轉到orderItem中
            OrderItem.create({
              OrderId: order.id,
              ProductId: item.dataValues.id,
              price: item.dataValues.price,
              quantity: item.dataValues.Cart_item.quantity
            });
          });
          return order;
        })
        .then(order => {
          Shipment.create({
            OrderId: order.id,
            ShipmentStatusId: 1, //預設為1 未出貨
            ShipmentTypeId: req.body.shipmentType
          });
          Payment.create({
            OrderId: order.id,
            PaymentStatusId: 1, //預設為1 未匯款
            PaymentTypeId: req.body.paymentType,
            amount: subtotal
          });

          return order;
        })
        .then(order => {
          //nodemail send mail
          var mailOptions = {
            from: "vuvu0130@gmail.com",
            to: req.user.email,
            subject: `${order.id} 訂單成立`,
            text: `${order.id} 訂單成立`
          };

          smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
          });
          return order

        }).then(order => {

          //清除購物車與caartItem
          Cart.destroy({ where: { id: req.body.cartId } });
          CartItem.destroy({ where: { CartId: req.body.cartId } });
          //清空session暫存

          req.session.cartItemNum = 0
          //導向付款
          const PaymentTypeId = req.body.paymentType;
          const ShipmentTypeId = req.body.shipmentType;

          if (PaymentTypeId === "1") return res.redirect(`order/${order.id}/payment`);
          if (ShipmentTypeId === "2") return res.redirect(`/order/${order.id}/branchselection`);
          return res.redirect(`/order/${order.id}/success?discount=${discount}`);
        })
    })
  },
  getOrderSuccess: (req, res) => {
    Order.findByPk(req.params.id, {
      include: [
        { model: Product, as: "items", include: [OrderItem] },
        { model: ShipmentType, as: "ShipmentType" },
        { model: PaymentType, as: "PaymentType" },
        { model: ShipmentStatus, as: "ShipmentStatus" },
        { model: PaymentStatus, as: "PaymentStatus" },
        { model: Shipment_convenienceStore, as: "ShipmentConvenienceStore" },
        { model: Order_status }

      ]
    }).then(order => {
      //取得為折抵的總價
      let originAmount = order.items.length > 0 ? order.items.map(d => d.price * d.Order_item.quantity).reduce((a, b) => a + b) : 0;
      let shippingFee = 60
      let subtotal = 0

      if (originAmount < 999) {
        subtotal = originAmount + shippingFee
      } else {
        shippingFee = 0
        subtotal = originAmount
      }

      return res.render('orderSuccess', { order, originAmount, shippingFee, subtotal })
    })
  },

  cancelOrder: (req, res) => {
    Order.findByPk(req.params.id, {
      include: [
        { model: ShipmentStatus, as: "ShipmentStatus" },
        { model: ShipmentType, as: "ShipmentType" }
      ]
    })
      .then(order => {
        let lastOne = order.ShipmentStatus.length - 1;
        //限定shipmentStatus為 未出貨 ，才能取消
        //取得order的shipmentStatus的最後一個
        if (order.ShipmentStatus[lastOne].shipmentStatus === "備貨中") {

          order.update({
            OrderStatusId: 4
          })
        }
        return order;
      })
      .then(order => {
        res.redirect("back");
      });
  },

  getPayment: (req, res) => {

    Order.findByPk(req.params.id, {
      include: [User, { model: Product, as: "items", include: [CartItem] }]
    }).then(order => {
      const orderItemName = order.items.map(d => d.name);
      const tradeInfo = getTradeInfo(
        order.amount,
        orderItemName,
        order.User.email
      );
      order
        .update({
          ...req.body,
          memo: tradeInfo.MerchantOrderNo
        })
        .then(order => {
          res.render("payment", { order, tradeInfo });
        });
    });
  },

  spgatewayCallback: (req, res) => {
    const data = JSON.parse(decryptTradeInfo(req.body.TradeInfo));

    console.log("===== spgatewayCallback: create_mpg_aes_decrypt、data =====");
    console.log(data);

    Order.findAll({
      include: [Payment, User, { model: PaymentType, as: "PaymentType" }],
      where: { memo: data["Result"]["MerchantOrderNo"] }
    }).then(orders => {

      Payment.findOne({ where: { OrderId: orders[0].id } }).then(payment => {
        Payment.create({
          OrderId: orders[0].id,
          PaymentStatusId: 2,
          PaymentTypeId: payment.PaymentTypeId,
          amount: payment.amount
        }).then(() => {
          res.redirect(`/order/${orders[0].id}/success`);
        });
      });
    });
  },

  getBranchSelection: (req, res) => {

    Order.findByPk(req.params.id, {
      include: [User, { model: Product, as: "items", include: [CartItem] }]
    }).then(order => {

      const pickupInfo = getPickupInfo()
      order
        .update({
          ...req.body,
          memo: pickupInfo.MerchantTradeNo
        })
        .then(order => {
          res.render("branchSelection", { order, pickupInfo });
        });
    });
  },

  pickupCallback: (req, res) => {
    const MerchantTradeNo = req.body.MerchantTradeNo
    const branchName = req.body.CVSStoreName
    const branchAddress = req.body.CVSAddress

    Order.findAll({
      include: [Shipment, User, { model: Shipment_convenienceStore, as: "ShipmentConvenienceStore" }],
      where: { memo: MerchantTradeNo }
    }).then(orders => {

      Shipment_convenienceStore.create({
        id: orders[0].id,
        branch: branchName,
        address: branchAddress
      })

      Shipment.findOne({ where: { OrderId: orders[0].id } }).then((shipment) => {

        shipment.update({
          ...req.body,
          ShipmentConvenienceStoreId: orders[0].id
        }).then(() => {
          res.redirect(`/order/${orders[0].id}/success`);
        });
      });
    });
  }
};
module.exports = orderController;
