const db = require("../models");
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const User = db.User
const Order = db.Order
const OrderItem = db.Order_item
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
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: [{ model: Product, as: 'items', include: [CartItem] }] }).then(cart => {
      //建立order  
      console.log(req.body.shipmentType)
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
            quantity: item.dataValues.CartItem.quantity,
          })
        });
        let userId = Number(req.user.id)
        return res.redirect(`/user/${userId}/profile`)

      })
    })
  },
  deleteOrder: (req, res) => {
    Order.destroy({
      where: {
        id: req.params.id
      }
    }).then(
      () => {
        return res.redirect('back')
      }
    )
  }

}
module.exports = orderController