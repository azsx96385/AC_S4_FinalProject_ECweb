//引入需要之model
const db = require("../../models");
const moment = require("moment");
const userModel = db.User;
const orderModel = db.Order;
const paymentModel = db.Payment;
const paymentStatusModel = db.Payment_status;
const paymentTypeModel = db.Payment_type;
//--
const shipmentModel = db.Shipment;
const shipmentStatusModel = db.Shipment_status;
const shipmentTypeModel = db.Shipment_type;

const orderController = {
  //顯示全部訂單
  getOrderManagePage: (req, res) => {
    orderModel
      .findAll({
        include: [
          { model: userModel },
          {
            model: paymentModel,
            include: [
              //{ model: paymentTypeModel }
              { model: paymentStatusModel }
            ]
          },
          {
            model: shipmentModel,
            include: [
              { model: shipmentStatusModel }
              //{ model: shipmentTypeModel }
            ]
          }
        ]
      })
      .then(orders => {
        // let t = orders[0].dataValues.Shipments[0];
        // console.log(t);

        let order_format = orders.map(item => ({
          ...item.dataValues,
          orderDate: moment(item.dataValues.createdAt).format(
            "YYYY-MM-DD HH:mm"
          ),
          paymentStatus:
            item.dataValues.Payments[0].dataValues.Payment_status.paymentStatus,
          shipmentStatus:
            item.dataValues.Shipments[0].dataValues.Shipment_status
              .shipmentStatus
        }));
        res.render("admin/productmodel_orders", {
          orders: order_format,
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
