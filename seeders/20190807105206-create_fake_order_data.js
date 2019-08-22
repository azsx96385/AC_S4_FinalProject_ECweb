"use strict";

//cart cartItems
//shipments shipment_statuses shipment_types
//payments payment_statuses payment_types
//Orders OrderItems
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    //cart cartItems
    //三台購物車，隨機配3項商品，數量1-3隨機
    queryInterface.bulkInsert("Carts", [
      {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    queryInterface.bulkInsert(
      "Cart_items",
      [1, 1, 1, 2, 2, 2, 3, 3, 3].map((item, index) => ({
        CartId: item,
        ProductId: Math.floor(Math.random() * 9),
        quantity: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
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

    //Orders OrderItems payment shipment
    //Order 記錄訂單-訂購人資訊 | 建立3筆訂單
    queryInterface.bulkInsert(
      "Orders",
      [2, 3, 4].map((item, index) => ({
        UserId: item,
        StoreId: 1,
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
        ProductId: Math.floor(Math.random() * 9),
        OrderId: Math.floor(Math.random() * 3),
        quantity: Math.floor(Math.random() * 3),
        price: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //shipment 紀錄訂單-送貨狀況
    queryInterface.bulkInsert(
      "Shipments",
      [1, 2, 3].map((item, index) => ({
        OrderId: item,
        ShipmentStatusId: Math.floor(Math.random() * 7),
        ShipmentTypeId: Math.floor(Math.random() * 3),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //payment 紀錄訂單-收款狀況
    return queryInterface.bulkInsert(
      "Payments",
      [1, 2, 3].map((item, index) => ({
        OrderId: item,
        PaymentStatusId: Math.floor(Math.random() * 4),
        PaymentTypeId: Math.floor(Math.random() * 4),
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
    queryInterface.bulkDelete("Carts", null, {});

    return queryInterface.bulkDelete("People", null, {});
  }
};
