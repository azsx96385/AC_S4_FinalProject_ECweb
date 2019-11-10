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

const orderService = {
  //顯示全部訂單
  getOrderManagePage: (req, res, callback) => {
    //預設資料
    let offset = 0;
    let pageLimit = 50;
    let whereQuery = { StoreId: 1 };
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    if (req.query.orderstatusid) {
      whereQuery["OrderStatusId"] = req.query.orderstatusid;
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
        // let t = orders.rows[0].Shipments[0].dataValues.ShipmentStatusId;
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
          orderer: item.User.name,
          orderStatus: item.dataValues.Order_status.orderStatus,
          paymentStatusId: item.Payments[0].dataValues.PaymentStatusId,
          shipmentStatusId: item.Shipments[0].dataValues.ShipmentStatusId,
          paymentStatus:
            item.dataValues.Payments[item.dataValues.Payments.length - 1]
              .dataValues.Payment_status.paymentStatus,
          shipmentStatus:
            item.dataValues.Shipments[item.dataValues.Shipments.length - 1]
              .dataValues.Shipment_status.shipmentStatus
        }));
        console.log(order_format[0].orderer);
        if (req.query.shipmentstatusid) {
          console.log(order_format[0]);
          order_format = order_format.filter(shipmentFilter);
        } else if (req.query.paymentstatusid) {
          order_format = order_format.filter(paymentFilter);
        } else if (req.query.orderer) {
          order_format = order_format.filter(ordererFilter);
        }

        // //建立shipmentStatus 篩選器
        function paymentFilter(order) {
          return order.paymentStatusId == req.query.paymentstatusid;
        }
        function shipmentFilter(order) {
          return order.shipmentStatusId == req.query.shipmentstatusid;
        }
        function ordererFilter(order) {
          return order.orderer == req.query.orderer;
        }

        callback({
          page,
          totalPage,
          lastPage,
          nextPage,
          orders: order_format,
          layout: "admin_main"
        });
      });
  },
  // 單一 | 顯示單筆訂單
  getOrder: (req, res, callback) => {
    let orderId = req.params.id

    orderModel
      .findByPk(orderId, {
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

        let shippingFee = 0
        const amount = order.amount
        if (amount - 60 < 939) {
          shippingFee = 60
        }
        //console.log(order.Payments[order.Payments.length - 1]);

        callback({
          order,
          orderer,
          orderStatus,
          paymentStatus,
          paymentType,
          shipmentStatus,
          shipmentType,
          shippingFee,
          layout: "admin_main"
        });
      });
  },
  // 單一 | 訂單詳細頁-更改訂單狀態
  putOrderStatus: (req, res, callback) => {
    //驗證身分(訂單storeId & user storeId)
    //調出修改參數
    let orderId = req.params.orderId;
    let { OrderStatusId, memo } = req.body;

    //調出訂單資料-修改更新資料
    return orderModel.findByPk(orderId).then(orderData => {
      orderData.update({ OrderStatusId, memo }).then(data => {
        return callback({ status: 'success', message: "" })
      });
    });
  },
  // 單一 | 訂單詳細頁-更改訂單付款狀態
  putPaymentStatus: (req, res, callback) => {
    //驗證身分
    //調整修改參數
    let OrderId = req.params.orderId;
    let { PaymentStatusId, PaymentTypeId } = req.body;
    //新增該筆訂單付款紀錄
    return paymentModel
      .create({ OrderId, PaymentStatusId, PaymentTypeId })
      .then(data => {
        return callback({ status: 'success', message: "" })
      });
  },
  // 單一 | 訂單詳細頁-更改訂單送貨狀態
  putShipmentStatus: (req, res, callback) => {
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
            return callback({ status: 'success', message: "" })
          });
        });
      });
  }
}

module.exports = orderService