'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Product_categories',
      ['咖啡豆', '花茶', '零食', '文創雜貨']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            image: 'https://blog.payoneer.com/wp-content/uploads/2014/10/Amazon-Buy-Box.png',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product_categories', null, {});
  }
};
