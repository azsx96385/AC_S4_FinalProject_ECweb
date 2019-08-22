'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order_status = sequelize.define('Order_status', {
    orderStatus: DataTypes.STRING
  }, {});
  Order_status.associate = function(models) {
    // associations can be defined here
  };
  return Order_status;
};