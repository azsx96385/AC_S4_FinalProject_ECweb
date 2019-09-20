"use strict";
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
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
    return queryInterface.bulkDelete("Comments", null, {});
  }
};
