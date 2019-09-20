"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    //shipment 紀錄訂單-送貨狀況
    queryInterface.bulkInsert(
      "Shipments",
      [1, 2, 0].map((item, index) => ({
        OrderId: 1,
        ShipmentStatusId: Math.floor(Math.random() * 7),
        ShipmentTypeId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //payment 紀錄訂單-收款狀況
    return queryInterface.bulkInsert(
      "Payments",
      [1, 2, 0].map((item, index) => ({
        OrderId: item,
        PaymentStatusId: Math.floor(Math.random() * 3) + 1,
        PaymentTypeId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Payments", null, {});
    return queryInterface.bulkDelete("Shipments", null, {});
  }
};
