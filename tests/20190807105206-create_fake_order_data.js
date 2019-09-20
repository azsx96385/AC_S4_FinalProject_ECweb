"use strict";

//cart cartItems
//shipments shipment_statuses shipment_types
//payments payment_statuses payment_types
//Orders OrderItems

module.exports = {
  up: (queryInterface, Sequelize) => {
    //
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Payments", null, {});
    queryInterface.bulkDelete("Shipments", null, {});
    queryInterface.bulkDelete("Order_items", null, {});
    queryInterface.bulkDelete("Payment_statuses", null, {});
    queryInterface.bulkDelete("Payment_types", null, {});
    queryInterface.bulkDelete("Shipment_types", null, {});
    queryInterface.bulkDelete("Shipment_statuses", null, {});
    queryInterface.bulkDelete("Cart_items", null, {});
    return queryInterface.bulkDelete("Carts", null, {});

    // return queryInterface.bulkDelete("People", null, {});
  }
};
