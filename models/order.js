"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      UserId: DataTypes.INTEGER,
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
    Order.belongsToMany(models.Shipment_type, {
      as: 'ShipmentType',
      through: {
        model: models.Shipment, unique: false
      },
      foreignKey: 'OrderId'
    })
    Order.belongsToMany(models.Shipment_status, {
      as: 'ShipmentStatus',
      through: {
        model: models.Shipment, unique: false
      },
      foreignKey: 'OrderId'
    })
    Order.belongsToMany(models.Payment_status, {
      as: 'PaymentStatus',
      through: {
        model: models.Payment, unique: false
      },
      foreignKey: 'OrderId'
    })
    Order.belongsToMany(models.Payment_type, {
      as: 'PaymentType',
      through: {
        model: models.Payment, unique: false
      },
      foreignKey: 'OrderId'
    })


  };
  return Order;
};
