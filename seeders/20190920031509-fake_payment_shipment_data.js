"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    //shipment 紀錄訂單-送貨狀況
    queryInterface.bulkInsert(
      "Shipments",
      [1, 2, 3].map((item, index) => ({
        OrderId: item,
        ShipmentStatusId: 3,
        ShipmentTypeId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //payment 紀錄訂單-收款狀況
    return queryInterface.bulkInsert(
      "Payments",
      [1, 2, 3].map((item, index) => ({
        OrderId: item,
        PaymentStatusId: 2,
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
