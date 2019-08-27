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
            item.dataValues.Payments[item.dataValues.Payments.length - 1]
              .dataValues.Payment_status.paymentStatus,
          shipmentStatus:
            item.dataValues.Shipments[item.dataValues.Shipments.length - 1]
              .dataValues.Shipment_status.shipmentStatus
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
        let paymentStatus =
          order.Payments[order.Payments.length - 1].Payment_status
            .paymentStatus;
        let paymentType =
          order.Payments[order.Payments.length - 1].Payment_type.paymentType;
        let shipmentStatus =
          order.Shipments[order.Shipments.length - 1 || 0].Shipment_status
            .shipmentStatus;
        let shipmentType =
          order.Shipments[order.Shipments.length - 1 || 0].Shipment_type
            .shipmentType;
        //console.log(order.Payments[order.Payments.length - 1]);
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
  },
  // 單一 | 訂單詳細頁-更改訂單狀態
  putOrderStatus: (req, res) => {
    //驗證身分(訂單storeId & user storeId)
    //調出修改參數
    let orderId = req.params.orderId;
    let { OrderStatusId, memo } = req.body;

    //調出訂單資料-修改更新資料
    return orderModel.findByPk(orderId).then(orderData => {
      orderData.update({ OrderStatusId, memo }).then(data => {
        return res.redirect("back");
      });
    });
  },
  // 單一 | 訂單詳細頁-更改訂單付款狀態
  putPaymentStatus: (req, res) => {
    //驗證身分
    //調整修改參數
    let OrderId = req.params.orderId;
    let { PaymentStatusId, PaymentTypeId } = req.body;
    //新增該筆訂單付款紀錄
    return paymentModel
      .create({ OrderId, PaymentStatusId, PaymentTypeId })
      .then(data => {
        return res.redirect("back");
      });
  },
  // 單一 | 訂單詳細頁-更改訂單送貨狀態
  putShipmentStatu: (req, res) => {
    //驗證身分
    //調整修改參數
    let OrderId = req.params.orderId;
    let { ShipmentStatusId, ShipmentTypeId, name, phone, address } = req.body;
    //新增該筆訂單配送紀錄
    return shipmentModel
      .create({ OrderId, ShipmentStatusId, ShipmentTypeId })
      .then(data => {
        return orderModel.findByPk(OrderId).then(order => {
          order.update({ name, phone, address }).then(data => {
            return res.redirect("back");
          });
        });
      });
  }
  // 單一 | 訂單詳細頁-更改訂單訂購人資訊
};
module.exports = orderController;
