"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      UserId: DataTypes.INTEGER,
      StoreId: DataTypes.INTEGER,
      OrderStatusId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      memo: DataTypes.STRING
    },
    {}
  );
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Order_status);
    Order.belongsToMany(models.Product, {
      as: "items",
      through: {
        model: models.Order_item,
        unique: false
      },
      foreignKey: "OrderId"
    });
    Order.belongsTo(models.User);
    Order.hasMany(models.Payment);
    // Order.hasMany(models.Payment);
    Order.hasMany(models.Shipment);
  };
  return Order;
};
