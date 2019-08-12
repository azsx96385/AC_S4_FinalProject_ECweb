'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Coupon_types',
      ['會員專屬', '節日促銷']
        .map((item, index) =>
          ({
            id: index + 1,
            couponType: item,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Coupon_types', null, {});
  }
};
