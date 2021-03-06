'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order_item = sequelize.define('Order_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ProductId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {});
  Order_item.associate = function (models) {
    // associations can be defined here
    Order_item.belongsTo(models.Product)
  };
  return Order_item;
};