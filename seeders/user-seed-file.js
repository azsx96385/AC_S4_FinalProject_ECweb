'use strict'
const bcrypt = require('bcrypt')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),

      name: 'root',
      address: faker.address.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerf: 0,
      StoreId: 0,
    }, {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),

      name: 'user1',
      address: faker.address.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerf: 0,
      StoreId: 0,
    }, {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),

      name: 'user2',
      address: faker.address.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerf: 0,
      StoreId: 0

    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}