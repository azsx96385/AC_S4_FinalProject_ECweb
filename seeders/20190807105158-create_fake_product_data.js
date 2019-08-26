"use strict";
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 產品分類 | 米國電子 |1-電視類 / 2-冰箱類 / 3-洗衣機類
    queryInterface.bulkInsert(
      "Product_categories",
      ["南美原豆", "法國葡萄酒", "小農食材", '手作文創'].map((item, index) => ({
        StoreId: 1,
        name: item,
        image: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    //產品 | 米國電子 storeId 1 |
    //每個分類各3項產品，存貨10，皆未上架，價格200，描述自訂，圖像自訂

    let products = [1, 1, 1, 2, 2, 2, 3, 3, 3].map((item, index) => ({
      StoreId: 1,
      ProductCategoryId: item,
      name: faker.commerce.productName(),
      count: 10,
      launched: 0,
      price: 1000,
      description: faker.lorem.text().substring(0, 100),
      image: faker.image.imageUrl(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    queryInterface.bulkInsert("Products", products);

    //評語
    return queryInterface.bulkInsert(
      "Comments",
      [...Array(150)]
        .map((item, index) => index)
        .map(i => ({
          UserId: Math.floor(Math.random() * 4) + 1,
          ProductId: Math.floor(Math.random() * 4) + 1,
          comment: faker.lorem.sentence(),
          rating: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Comments", null, {});
    queryInterface.bulkDelete("Products", null, {});
    return queryInterface.bulkDelete("Product_categories", null, {});
  }
};
