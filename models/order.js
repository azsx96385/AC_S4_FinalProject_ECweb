'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    UserId: DataTypes.INTEGER,
    Payment_statusId: DataTypes.INTEGER,
    Payment_typeId: DataTypes.INTEGER,
    Shipment_statusId: DataTypes.INTEGER,
    Shipment_typeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    memo: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};