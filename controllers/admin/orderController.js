//引入需要之model
const db = require("../../models");
const userModel = db.User;
const orderModel = db.Order;

const orderController = {
  //顯示全部訂單
  getOrderManagePage: (req, res) => {
    orderModel.findAll({ include: [{ model: userModel }] }).then(orders => {
      console.log("XXXXXXXXXXXXX", orders[0]);
      res.render("admin/productmodel_orders", {
        orders: orders,
        layout: "admin_main"
      });
    });
  }
  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面
  // 單一 | 顯示單筆訂單
  // 單一 | 更改訂單狀態
  // 單一 | 更改訂單付款狀態
  // 單一 | 更改訂單送貨狀態
  // 單一 | 更改訂單訂購人資訊
};
module.exports = orderController;
