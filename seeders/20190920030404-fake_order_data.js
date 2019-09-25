"use strict";
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    //Orders OrderItems OrderStatus payment shipment

    return queryInterface
      .bulkInsert(
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
      )
      .then(data => {
        //Order-item 紀錄訂單中商品
        return queryInterface.bulkInsert(
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
      });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Order_items", null, {});
    return queryInterface.bulkDelete("Orders", null, {});
  }
};
