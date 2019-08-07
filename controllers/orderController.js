const db = require("../models");
const Cart = db.Cart
const CartItem = db.Cart_item
const Product = db.Product
const User = db.User
const Order = db.Order
const OrderItem = db.Order_item
/*---------------------處理payment跟shipment------------------------------*/
const Payment = db.Payment
const Shipment = db.Shipment
const Shipment_status = db.Shipment_status
const Shipment_type = db.Shipment_type

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

const orderController = {

  getOrderEdit: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0
      return User.findByPk(req.user.id).then(user => {
        return res.render('orderEdit', {
          cart,
          totalPrice,
          user

        })
      })

    })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {
      //建立order  

      return Order.create({
        UserId: req.user.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        amount: req.body.amount,
        //還要處理payment跟shipment
      }).then(order => {
        //建立order_item

        cart.items.forEach(item => { //從購物車中的item移轉到orderItem中

          OrderItem.create({
            OrderId: order.id,
            ProductId: item.dataValues.id,
            price: item.dataValues.price,
            quantity: item.dataValues.Cart_item.quantity,
          })
        })
        return order
      }).then(order => {
        console.log(req.body.paymentType)
        console.log(req.body.shipmentType)

        Shipment.create({
          OrderId: order.id,
          ShipmentStatusId: 1,//預設為1 未出貨
          ShipmentTypeId: req.body.shipmentType,

        })
        Payment.create({
          OrderId: order.id,
          PaymentStatusId: 1,//預設為1 未匯款
          PaymentTypeId: req.body.paymentType,
          amount: 0
        })

        return order
      })
        .then(order => {
          //nodemail send mail
          var mailOptions = {
            from: 'vuvu0130@gmail',
            to: 'vuvu0130@gmail',
            subject: `${order.id} 訂單成立`,
            text: `${order.id} 訂單成立`,
          };

          smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
          });;

          return res.redirect(`order/${order.id}/payment`)
        }
        )

    })


  },
  cancelOrder: (req, res) => {
    Order.findByPk(req.params.id, { include: [{ model: Shipment_status, as: 'ShipmentStatus' }, { model: Shipment_type, as: 'ShipmentType' }] }).then(order => {

      let lastOne = order.ShipmentStatus.length - 1
      //限定shipmentStatus為 未出貨 ，才能取消
      //取得order的shipmentStatus的最後一個
      if (order.ShipmentStatus[lastOne].shipmentStatus === '未出貨') {

        Shipment.create({
          OrderId: req.params.id,
          ShipmentStatusId: 3, // 取消為3
          ShipmentTypeId: order.ShipmentType[0].id
        })
      }
      return order



    }).then(order => {
      res.redirect('back')
    })
  },

  getPayment: (req, res) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id).then(order => {
      res.render('payment', { order })
    })
  },

  spgatewayCallback: (req, res) => {
    console.log('===== spgatewayCallback =====')
    console.log(req.body)
    console.log('==========')

    res.redirect('back')
  }

}
module.exports = orderController
