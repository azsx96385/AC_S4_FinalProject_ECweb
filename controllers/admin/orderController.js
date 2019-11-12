const orderService = require("../../services/admin/orderService")

const orderController = {
  //顯示全部訂單
  getOrderManagePage: (req, res) => {
    orderService.getOrderManagePage(req, res, (data) => {
      res.render("admin/productmodel_orders", data);
    })
  },
  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面
  // 單一 | 顯示單筆訂單
  getOrder: (req, res) => {
    orderService.getOrder(req, res, (data) => {
      res.render("admin/productmodel_orderdetail", data);
    })
  },
  // 單一 | 訂單詳細頁-更改訂單狀態
  putOrderStatus: (req, res) => {
    orderService.putOrderStatus(req, res, (data) => {
      return res.redirect("back");
    })
  },
  // 單一 | 訂單詳細頁-更改訂單付款狀態
  putPaymentStatus: (req, res, callback) => {
    orderService.putPaymentStatus(req, res, (data) => {
      return res.redirect("back");
    })
  },
  // 單一 | 訂單詳細頁-更改訂單送貨狀態
  putShipmentStatus: (req, res) => {
    orderService.putShipmentStatus(req, res, (data) => {
      return res.redirect("back");
    })
  }
  // 單一 | 訂單詳細頁-更改訂單訂購人資訊
};
module.exports = orderController;
