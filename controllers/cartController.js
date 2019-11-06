const cartService = require('../services/cartService')

const cartController = {
  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      res.render("cart", data);
    })
  },

  postCart: async (req, res) => {
    cartService.postCart(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        return res.redirect('back')
      }
    })
  },

  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, (data) => {
      return res.redirect('back')
    })
  },

  subCartItem: (req, res) => {
    cartService.subCartItem(req, res, (data) => {
      return res.redirect('back')
    })
  },

  deleteCartItem: (req, res) => {
    cartService.deleteCartItem(req, res, (data) => {
      return res.redirect('back')
    })
  }
}

module.exports = cartController;