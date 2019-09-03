"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    "Shipment",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      OrderId: DataTypes.INTEGER,
      ShipmentStatusId: DataTypes.INTEGER,
      ShipmentTypeId: DataTypes.INTEGER,
      ShipmentConvenienceStoreId: DataTypes.INTEGER
    },
    {}
  );
  Shipment.associate = function (models) {
    // associations can be defined here
    Shipment.belongsTo(models.Order);
    Shipment.belongsTo(models.Shipment_status);
    Shipment.belongsTo(models.Shipment_type);
  };
  return Shipment;
};
