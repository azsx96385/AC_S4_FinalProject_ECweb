"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // shipment_statuses shipment_types
    queryInterface.bulkInsert(
      "Shipment_statuses",
      [
        "備貨中",
        "發貨中",
        "已發貨",
        "已到達",
        "已取貨",
        "已退貨",
        "退貨中"
      ].map((item, index) => ({
        shipmentStatus: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    queryInterface.bulkInsert(
      "Shipment_types",
      ["宅配", "超商取貨", "面交"].map((item, index) => ({
        shipmentType: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // payment_statuses payment_types
    queryInterface.bulkInsert(
      "Payment_types",
      ["信用卡", "LINPAY", "GOOGLEAY", "匯款"].map((item, index) => ({
        paymentType: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    queryInterface.bulkInsert(
      "Payment_statuses",
      ["未付款", "已付款", "退款中", "已退款"].map((item, index) => ({
        paymentStatus: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    //Order 記錄訂單-訂購人資訊 | 建立3筆訂單
    return queryInterface.bulkInsert(
      "Order_statuses",
      ["排程中", "處理中", "已完成", "已取消"].map((item, index) => ({
        orderStatus: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Order_statuses", null, {});
    queryInterface.bulkDelete("Payment_statuses", null, {});
    queryInterface.bulkDelete("Payment_types", null, {});
    queryInterface.bulkDelete("Shipment_types", null, {});
    return queryInterface.bulkDelete("Shipment_statuses", null, {});
  }
};
