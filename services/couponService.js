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

const couponService = {
  getCouponMakePage: (req, res, callback) => {
    callback({ layout: "admin_main" })
  },

  postCouponMake: (req, res, callback) => {
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
      available: true,
      expireDate: req.body.expiredDate,

    }).then(coupon => {
      Coupon.findByPk(coupon.id, { include: CouponType }).then(
        coupon => {
          callback({ coupon, layout: "admin_main" })
        }
      )
    })
  },

  checkCoupon: async (req, res, callback) => {
    let cart = await Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] })
    let totalPrice = await cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item

    Coupon.findOne({
      where: {
        couponCode: req.body.couponCode
      }
    }).then(coupon => {
      //如果coupon序號不存在
      if (!coupon) {
        return callback({ status: 'error', message: "此序號不存在" })
      }
      //檢查其狀態是否能使用
      if (coupon.availabe === 0) {
        return callback({ status: 'error', message: "此序號已過期" })
      }
      if (totalPrice < coupon.discount) {
        return callback({ status: 'error', message: "你不能折抵超過你所消費的金額" })
      }
      let couponId = coupon.id
      return callback({ status: 'success', message: "成功折抵", couponId })
    })
  },

  getCouponOrderEdit: (req, res, callback) => {
    Coupon.findByPk(req.params.couponId).then(coupon => {
      return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0

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
          return callback({
            cart,
            totalPrice,
            user,
            coupon,
            subtotal,
            shippingFee
          })
        })
      })
    })
  },

  //admin管理coupon
  getCouponManagePage: (req, res, callback) => {
    let today = new Date()

    Coupon.findAll({ include: [CouponType] }).then(coupons => {
      //如果過期，就自動失效
      coupons.map(coupon => {
        if (today > coupon.expireDate) {
          coupon.update({
            ...coupon,
            available: false
          })
        }
        return coupon
      })
      return coupons

    }).then(coupons => {
      callback({ coupons, layout: "admin_main" })
    })
  },

  getCouponEditPage: (req, res, callback) => {
    Coupon.findByPk(req.params.id, { include: CouponType }).then(
      coupon => {
        callback({ coupon, layout: "admin_main" })
      }
    )
  },

  postCouponEdit: (req, res, callback) => {
    return Coupon.findByPk(req.body.couponId).then(
      coupon => {
        return coupon.update({
          StoreId: req.body.StoreId,
          CouponTypeId: req.body.couponTypeId,
          discount: req.body.CouponDiscount,
          description: req.body.CouponDescription,
          available: req.body.available,
          expireDate: req.body.expiredDate,
        })
      }
    ).then(() => {
      return callback({ status: 'success', message: "已成功修改" })
    })
  }
}

module.exports = couponService