const cartService = require('../../services/cartService')

const cartController = {
  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      res.json(data);
    })
  },

  postCart: async (req, res) => {
    cartService.postCart(req, res, (data) => {
      res.json(data);
    })
  },

  addCartItem: async (req, res) => {
    cartService.addCartItem(req, res, (data) => {
      res.json(data);
    })
  },

  subCartItem: async (req, res) => {
    cartService.subCartItem(req, res, (data) => {
      res.json(data);
    })
  },

  deleteCartItem: async (req, res) => {
    cartService.deleteCartItem(req, res, (data) => {
      res.json(data);
    })
  },
}

module.exports = cartController;