const db = require("../models");
const Cart = db.Cart
const CartItem = db.Cart_item
const Product = db.Product
const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {

      cart = cart || { items: [] }


      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.Cart_item.quantity).reduce((a, b) => a + b) : 0//如果cart-item沒東西，則為0

      return res.render('cart', {
        cart,
        totalPrice

      })
    })
  },
  postCart: async (req, res) => {
    return Cart.findOrCreate({//找到或創造visitor的cart
      where: {
        id: req.session.cartId || 0,//沒有，則預設為0
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
            return res.redirect('back')
          })
        })
      })
    })
  },
  addCartItem: (req, res) => {
    return CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then(cartItem => {
          //加入cartItem數量
          req.session.cartItemNum = (req.session.cartItemNum || 0) + 1

          return res.redirect('back')
        })

    })
  },
  subCartItem: (req, res) => {
    return CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1

      })
      if (cartItem.quantity === 0) {
        return CartItem.destroy({
          where: {
            id: req.params.id
          }
        }).then(
          () => {
            req.session.cartItemNum = Number((req.session.cartItemNum || 0)) - 1
            res.redirect('back')
          }
        )
      }

    }).then(() => {
      return res.redirect('back')
    })
  },
  deleteCartItem: (req, res) => {
    return CartItem.destroy({
      where: {
        id: req.params.id
      }
    }).then(
      () => {
        //加入cartItem數量
        req.session.cartItemNum = 0

        return res.redirect('back')
      }
    )




  }

}
module.exports = cartController;