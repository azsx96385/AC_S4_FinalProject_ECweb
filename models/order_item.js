'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order_item = sequelize.define('Order_item', {
    ProductId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {});
  Order_item.associate = function(models) {
    // associations can be defined here
  };
  return Order_item;
};