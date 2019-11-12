const orderService = require("../../../services/admin/orderService")

const orderController = {
  getOrderManagePage: (req, res) => {
    orderService.getOrderManagePage(req, res, (data) => {
      res.json(data);
    })
  },

  getOrder: (req, res) => {
    orderService.getOrder(req, res, (data) => {
      res.json(data);
    })
  },

  putOrderStatus: (req, res) => {
    orderService.putOrderStatus(req, res, (data) => {
      res.json(data);
    })
  },

  putPaymentStatus: (req, res, callback) => {
    orderService.putPaymentStatus(req, res, (data) => {
      res.json(data);
    })
  },

  putShipmentStatus: (req, res) => {
    orderService.putShipmentStatus(req, res, (data) => {
      res.json(data);
    })
  }
}

module.exports = orderController