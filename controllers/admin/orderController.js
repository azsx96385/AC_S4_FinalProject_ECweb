//引入需要之model
const db = require("../../models");
const moment = require("moment");
const userModel = db.User;
const orderModel = db.Order;
const orderStatusModel = db.Order_status;
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
    //預設資料
    let offset = 0;
    let pageLimit = 50;
    let whereQuery = { StoreId: 1 };
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    orderModel
      .findAndCountAll({
        limit: pageLimit,
        offset: offset,
        where: whereQuery,
        include: [
          { model: userModel },
          { model: orderStatusModel },
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
        // let t = orders[0].dataValues.Order_status.orderStatus;
        // console.log(t);
        //頁碼
        let page = Number(req.query.page) || 1;
        let pages = Math.ceil(orders.count / pageLimit);
        let totalPage = Array.from({ length: pages }).map(
          (item, index) => index + 1
        );
        let lastPage = page - 1 < 1 ? 1 : page - 1;
        let nextPage = page + 1 > pages ? pages : page + 1;

        let order_format = orders.rows.map(item => ({
          ...item.dataValues,
          orderDate: moment(item.dataValues.createdAt).format(
            "YYYY-MM-DD HH:mm"
          ),
          orderStatus: item.dataValues.Order_status.orderStatus,
          paymentStatus:
            item.dataValues.Payments[0].dataValues.Payment_status.paymentStatus,
          shipmentStatus:
            item.dataValues.Shipments[0].dataValues.Shipment_status
              .shipmentStatus
        }));
        res.render("admin/productmodel_orders", {
          page,
          totalPage,
          lastPage,
          nextPage,
          orders: order_format,
          layout: "admin_main"
        });
      });
  },
  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面
  // 單一 | 顯示單筆訂單
  getOrder: (req, res) => {
    orderModel
      .findByPk(2, {
        include: [
          { model: userModel },
          { model: orderStatusModel },
          {
            model: paymentModel,
            include: [
              { model: paymentTypeModel },
              { model: paymentStatusModel }
            ]
          },
          {
            model: shipmentModel,
            include: [
              { model: shipmentStatusModel },
              { model: shipmentTypeModel }
            ]
          }
        ]
      })
      .then(order => {
        order.createdAt_format = moment(order.createdAt).format(
          "YYYY-MM-DD HH:mm"
        );

        let orderer = order.User;
        let orderStatus = order.Order_status.orderStatus;
        let paymentStatus = order.Payments[0].Payment_status.paymentStatus;
        let paymentType = order.Payments[0].Payment_type.paymentType;
        let shipmentStatus = order.Shipments[0].Shipment_status.shipmentStatus;
        let shipmentType = order.Shipments[0].Shipment_type.shipmentType;
        console.log(paymentStatus);
        res.render("admin/productmodel_orderdetail", {
          order,
          orderer,
          orderStatus,
          paymentStatus,
          paymentType,
          shipmentStatus,
          shipmentType,
          layout: "admin_main"
        });
      });
  }
  // 單一 | 更改訂單狀態
  // 單一 | 更改訂單付款狀態
  // 單一 | 更改訂單送貨狀態
  // 單一 | 更改訂單訂購人資訊
};
module.exports = orderController;
