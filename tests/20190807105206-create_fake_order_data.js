"use strict";

//cart cartItems
//shipments shipment_statuses shipment_types
//payments payment_statuses payment_types
//Orders OrderItems
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    //Orders OrderItems OrderStatus payment shipment

    queryInterface.bulkInsert(
      "Orders",
      [2, 3, 4].map((item, index) => ({
        UserId: item,
        StoreId: 1,
        OrderStatusId: Math.floor(Math.random() * 2) + 1,
        name: "water",
        amount: 2000,
        phone: "06-2626255",
        address: faker.address.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //Order-item 紀錄訂單中商品
    queryInterface.bulkInsert(
      "Order_items",
      [1, 2, 3].map((item, index) => ({
        ProductId: Math.floor(Math.random() * 7) + 1,
        OrderId: 1,
        quantity: Math.floor(Math.random() * 3),
        price: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
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
    queryInterface.bulkDelete("Shipments", null, {});
    queryInterface.bulkDelete("Order_items", null, {});
    queryInterface.bulkDelete("Payment_statuses", null, {});
    queryInterface.bulkDelete("Payment_types", null, {});
    queryInterface.bulkDelete("Shipment_types", null, {});
    queryInterface.bulkDelete("Shipment_statuses", null, {});
    queryInterface.bulkDelete("Cart_items", null, {});
    return queryInterface.bulkDelete("Carts", null, {});

    // return queryInterface.bulkDelete("People", null, {});
  }
};
