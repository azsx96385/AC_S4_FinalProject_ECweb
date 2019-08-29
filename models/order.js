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
  Order.associate = function (models) {
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
    Order.belongsToMany(models.Shipment_type, {
      as: "ShipmentType",
      through: {
        model: models.Shipment,
        unique: false
      },
      foreignKey: "OrderId"
    });
    Order.belongsToMany(models.Shipment_status, {
      as: "ShipmentStatus",
      through: {
        model: models.Shipment,
        unique: false
      },
      foreignKey: "OrderId"
    });
    Order.belongsToMany(models.Payment_status, {
      as: "PaymentStatus",
      through: {
        model: models.Payment,
        unique: false
      },
      foreignKey: "OrderId"
    });
    Order.belongsToMany(models.Payment_type, {
      as: "PaymentType",
      through: {
        model: models.Payment,
        unique: false
      },
      foreignKey: "OrderId"
    });
    Order.hasMany(models.Payment);
    Order.hasMany(models.Shipment);
    Order.belongsToMany(models.Shipment_convenienceStore, {
      as: "ShipmentConvenienceStore",
      through: {
        model: models.Shipment,
        unique: false
      },
      foreignKey: "OrderId"
    });

  };
  return Order;
};
