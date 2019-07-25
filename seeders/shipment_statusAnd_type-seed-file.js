'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Shipment_statuses',
      ['未出貨', '已出貨', '已取消']
        .map((item, index) =>
          ({
            id: index + 1,
            shipmentStatus: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    return queryInterface.bulkInsert('Shipment_types',
      ['宅配', '超商取貨']
        .map((item, index) =>
          ({
            id: index + 1,
            shipmentType: item,
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
    queryInterface.bulkDelete('Shipment_statuses', null, {});
    return queryInterface.bulkDelete('Shipment_types', null, {});
  }
};