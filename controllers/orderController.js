const orderService = require('../services/orderService')

const orderController = {
  getOrderEdit: (req, res) => {
    orderService.getOrderEdit(req, res, (data) => {
      return res.render("orderEdit", data);
    })
  },

  postOrder: async (req, res) => {
    orderService.postOrder(req, res, (data) => {
      if (data['PaymentTypeId'] === '1') {
        return res.redirect(`order/${data['order'].id}/payment`);
      } else if (data['ShipmentTypeId'] === '2') {
        return res.redirect(`/order/${data['order'].id}/branchselection`);
      }
      return res.redirect(`/order/${data['order'].id}/success?discount=${data['discount']}`);
    })
  },

  getOrderSuccess: (req, res) => {
    orderService.getOrderSuccess(req, res, (data) => {
      return res.render('orderSuccess', data)
    })
  },

  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, (data) => {
      return res.redirect("back");
    })
  },

  getPayment: (req, res) => {
    orderService.getPayment(req, res, (data) => {
      res.render("payment", data);
    })
  },

  spgatewayCallback: (req, res) => {
    orderService.spgatewayCallback(req, res, (data) => {
      res.redirect(`/order/${data['orders'][0].id}/success`);
    })
  },

  getBranchSelection: (req, res) => {
    orderService.getBranchSelection(req, res, (data) => {
      res.render("branchSelection", data);
    })
  },

  pickupCallback: (req, res) => {
    orderService.pickupCallback(req, res, (data) => {
      res.redirect(`/order/${data['orders'][0].id}/success`);
    })
  }
};
module.exports = orderController;
