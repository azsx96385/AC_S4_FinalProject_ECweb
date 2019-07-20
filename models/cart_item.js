'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart_item = sequelize.define('Cart_item', {
    ProductId: DataTypes.INTEGER,
    CartId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  Cart_item.associate = function(models) {
    // associations can be defined here
  };
  return Cart_item;
};