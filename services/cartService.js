const db = require("../models");
const Cart = db.Cart
const CartItem = db.Cart_item
const Product = db.Product
const Coupon = db.Coupon

const cartService = {
  getCart: (req, res, callback) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(async (cart) => {

      cart = cart || { items: [] }
      let shippingFee = 60
      let subtotal = 0
      //如果有使用coupon
      if (req.query.couponId) {

        let couponId = req.query.couponId
        let coupon = await Coupon.findByPk(couponId)

        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0

        //運費判斷
        if (totalPrice < 999) {
          subtotal = totalPrice + shippingFee
        } else {
          subtotal = totalPrice
          shippingFee = 0
        }

        return callback({
          cart,
          totalPrice,
          coupon,
          shippingFee,
          subtotal
        })
      }

      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0
      //運費判斷
      if (totalPrice < 999) {
        subtotal = totalPrice + shippingFee
      } else {
        subtotal = totalPrice
        shippingFee = 0
      }

      return callback({
        cart,
        totalPrice,
        shippingFee,
        subtotal
      })
    })
  },

  postCart: async (req, res, callback) => {
    return Cart.findOrCreate({//找到或創造visitor的cart
      where: {
        id: req.session.cartId || 1,//沒有，則預設為1
      }
    }).spread((cart, created) => {

      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
        }
      }).spread((cartItem, created) => {

        return cartItem.update({
          quantity: Number((cartItem.quantity || 0)) + Number(req.body.quantity),
        }).then((cartItem) => {
          req.session.cartId = cart.id
          //加入cartItem數量         
          req.session.cartItemNum = Number((req.session.cartItemNum || 0)) + Number(req.body.quantity)
          return req.session.save(() => {
            callback({ status: 'success', message: "已成功加入購物車" });
          })
        })
      })
    })
  },

  addCartItem: (req, res, callback) => {
    return CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then(cartItem => {
          //加入cartItem數量
          req.session.cartItemNum = (req.session.cartItemNum || 0) + 1
          return callback({ status: 'success', message: "" });
        })
    })
  },

  subCartItem: (req, res, callback) => {
    return CartItem.findByPk(req.params.id).then(cartItem => {
      let promise = []

      let update = cartItem.update({
        quantity: cartItem.quantity - 1

      })
      promise.push(update)
      if (cartItem.quantity === 0) {
        let destroy = CartItem.destroy({
          where: {
            id: req.params.id
          }
        })
        promise.push(destroy)
      }
      Promise.all(promise).then(() => {

        req.session.cartItemNum = Number((req.session.cartItemNum || 0)) - 1
        return callback({ status: 'success', message: "" });
      })
    })
  },

  deleteCartItem: (req, res, callback) => {
    return CartItem.destroy({
      where: {
        id: req.params.id
      }
    }).then(
      () => {
        //加入cartItem數量
        req.session.cartItemNum = 0
        return callback({ status: 'success', message: "" });
      }
    )
  }
}

module.exports = cartService;