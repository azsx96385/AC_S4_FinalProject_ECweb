"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    //cart cartItems
    //三台購物車，隨機配3項商品，數量1-3隨機
    queryInterface
      .bulkInsert("Carts", [
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
      ])
      .then(data => {
        return queryInterface.bulkInsert(
          "Cart_items",
          [1, 1, 1, 2, 2, 2, 3, 3, 3].map((item, index) => ({
            CartId: item,
            ProductId: Math.floor(Math.random() * 7) + 1,
            quantity: Math.floor(Math.random() * 3) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Cart_items", null, {});
    return queryInterface.bulkDelete("Carts", null, {});
  }
};
