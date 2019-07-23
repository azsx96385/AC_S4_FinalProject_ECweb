const db = require("../models");
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const User = db.User
const orderController = {

  getOrderEdit: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {

      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0
      return User.findByPk(req.user.id).then(user => {
        return res.render('orderEdit', {
          cart,
          totalPrice,
          user

        })
      })

    })
  },

}
module.exports = orderController