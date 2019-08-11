const db = require('../models')

const Cart = db.Cart
const CartItem = db.Cart_item
const Product = db.Product
const User = db.User
const Order = db.Order
const OrderItem = db.Order_item
//------coupon-------
const Coupon = db.Coupon
const CouponType = db.Coupon_type

/*---------------------處理payment跟shipment------------------------------*/
const Payment = db.Payment
const Shipment = db.Shipment
const Shipment_status = db.Shipment_status
const Shipment_type = db.Shipment_type



const couponController = {
  getCouponMakePage: (req, res) => {
    res.render('couponMake')
  },
  postCouponMake: (req, res) => {
    //產生亂數 couponCode
    function generateCouponCode() {
      var couponCode = '';
      var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 8; i++) {
        couponCode += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return couponCode
    }
    let code = generateCouponCode()

    Coupon.create({
      StoreId: req.body.storeId,
      CouponTypeId: req.body.couponTypeId,
      couponCode: code,
      discount: req.body.CouponDiscount,
      description: req.body.CouponDescription,
      availabe: true,

    }).then(coupon => {
      Coupon.findByPk(coupon.id, { include: CouponType }).then(
        coupon => {

          res.render('couponShow', { coupon })
        }
      )

    })
  },
  enterCoupon: (req, res) => {
    res.render('couponUsingPage')
  },
  checkCoupon: (req, res) => {
    Coupon.findOne({
      where: {
        couponCode: req.body.couponCode
      }
    }).then(coupon => {
      //如果coupon序號不存在
      if (!coupon) {
        req.flash("error_messages", "此序號不存在");
        return res.redirect('back')
      }
      //檢查其狀態是否能使用
      if (coupon.availabe === 0) {
        req.flash("error_messages", "此序號已過期");
        return res.redirect('back')
      }
      req.flash("success_messages", "成功折抵");
      return res.render('couponUsingPage', { coupon })

    })
  },

  getCouponOrderEdit: (req, res) => {
    Coupon.findByPk(req.params.couponId).then(coupon => {
      return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0
        let subtoal = totalPrice - coupon.discount
        return User.findByPk(req.user.id).then(user => {
          return res.render('orderEdit', {
            cart,
            totalPrice,
            user,
            coupon,
            subtoal
          })
        })

      })
    })

  },
}

module.exports = couponController