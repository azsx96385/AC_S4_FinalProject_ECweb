const orderService = require('../../services/orderService')

const orderController = {
  getOrderEdit: (req, res) => {
    orderService.getOrderEdit(req, res, (data) => {
      res.json(data);
    })
  },

  postOrder: async (req, res) => {
    orderService.postOrder(req, res, (data) => {
      res.json(data);
    })
  },

  getOrderSuccess: (req, res) => {
    orderService.getOrderSuccess(req, res, (data) => {
      res.json(data);
    })
  },

  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, (data) => {
      res.json(data);
    })
  },

  getPayment: (req, res) => {
    orderService.getPayment(req, res, (data) => {
      res.json(data);
    })
  },

  spgatewayCallback: (req, res) => {
    orderService.spgatewayCallback(req, res, (data) => {
      res.json(data);
    })
  },

  getBranchSelection: (req, res) => {
    orderService.getBranchSelection(req, res, (data) => {
      res.json(data);
    })
  },

  pickupCallback: (req, res) => {
    orderService.pickupCallback(req, res, (data) => {
      res.json(data);
    })
  }
}

module.exports = orderController