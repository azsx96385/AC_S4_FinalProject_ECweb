'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Payment_statuses',
      ['等待匯款', '已匯款']
        .map((item, index) =>
          ({
            id: index + 1,
            paymentStatus: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    return queryInterface.bulkInsert('Payment_types',
      ['線上付款', '貨到付款']
        .map((item, index) =>
          ({
            id: index + 1,
            paymentType: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ),


      {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    queryInterface.bulkDelete('Payment_statuses', null, {});
    return queryInterface.bulkDelete('Payment_types', null, {});
  }
};