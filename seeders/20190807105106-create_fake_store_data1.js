"use strict";

//注意| seed 是沒有經過 model 處理的
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Store_categories |3種類別3C類 / 服飾類 / 食品類
    return queryInterface.bulkInsert("store_categories", [
      { name: "3C類", createdAt: new Date(), updatedAt: new Date() },
      { name: "服飾類", createdAt: new Date(), updatedAt: new Date() },
      { name: "食品類", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("store_categories", null, {});
  }
};
