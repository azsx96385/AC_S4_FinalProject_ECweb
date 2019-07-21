'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments',
      [...Array(150)].map((item, index) => index).map(i =>
        ({
          id: i + 1,
          comment: faker.lorem.sentence(),
          UserId: Math.floor(Math.random() * 3) + 1,
          ProductId: i % 50 + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
