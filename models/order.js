"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      UserId: DataTypes.INTEGER,
      PaymentStatusId: DataTypes.INTEGER,
      PaymentTypeId: DataTypes.INTEGER,
      ShipmentStatusId: DataTypes.INTEGER,
      ShipmentTypeId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      memo: DataTypes.STRING
    },
    {}
  );
  Order.associate = function (models) {
    // associations can be defined here    
    Order.belongsToMany(models.Product, {
      as: 'items',
      through: {
        model: models.Order_item, unique: false
      },
      foreignKey: 'OrderId'
    })
    Order.belongsTo(models.User)
    Order.hasMany(models.Payment)
  };
  return Order;
};
