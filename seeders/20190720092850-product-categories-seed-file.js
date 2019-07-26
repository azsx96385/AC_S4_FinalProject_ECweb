'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Product_categories',
      ['咖啡豆', '花茶', '零食', '文創雜貨']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            image: faker.image.imageUrl(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product_categories', null, {});
  }
};
