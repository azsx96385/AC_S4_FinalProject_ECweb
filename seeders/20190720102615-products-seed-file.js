'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }).map((item, index) =>
        ({
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.lorem.text().substring(0, 100),
          price: faker.commerce.price(),
          image: faker.image.imageUrl(),
          ProductCategoryId: Math.floor(Math.random() * 4) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
