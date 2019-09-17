"use strict";
//假資料 - 米國電子|1位管理者|3位顧客
const bcrypt = require("bcryptjs");
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        StoreId: 1,
        role: 1,
        name: "root",
        email: "root@example.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        address: faker.address.streetAddress(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        image: "https://i.imgur.com/Uzs2ty3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerf: 0
      },
      {
        StoreId: 1,
        role: 0,
        name: "user1",
        email: "user1@example.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        address: faker.address.streetAddress(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        image: "https://i.imgur.com/Uzs2ty3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerf: 0
      },
      {
        StoreId: 1,
        role: 0,
        name: "user2",
        email: "user2@example.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        address: faker.address.streetAddress(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        image: "https://i.imgur.com/Uzs2ty3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerf: 0
      },
      {
        StoreId: 1,
        role: 0,
        name: "user3",
        email: "user3@example.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        address: faker.address.streetAddress(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        image: "https://i.imgur.com/Uzs2ty3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerf: 0
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
