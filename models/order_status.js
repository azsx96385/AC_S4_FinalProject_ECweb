'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order_status = sequelize.define('Order_status', {
    orderStatus: DataTypes.STRING
  }, {});
  Order_status.associate = function (models) {
    // associations can be defined here
    Order_status.hasMany(models.Order);
  };
  return Order_status;
};