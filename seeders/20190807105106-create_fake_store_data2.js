"use strict";

//注意| seed 是沒有經過 model 處理的
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Store_categories |3種類別3C類 / 服飾類 / 食品類

    return queryInterface.bulkInsert("Stores", [
      {
        StoreCategoryId: 1,
        name: "米國電子",
        description: "apple水貨都在這裡",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        StoreCategoryId: 2,
        name: "GG服飾 ",
        description: "櫻花妹最愛",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        StoreCategoryId: 3,
        name: "韓國包子",
        description: "最胡鬧的大餅都在這",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("stores", null, {});
  }
};
