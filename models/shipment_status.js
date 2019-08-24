"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shipment_status = sequelize.define(
    "Shipment_status",
    {
      shipmentStatus: DataTypes.STRING
    },
    {}
  );
  Shipment_status.associate = function (models) {
    // associations can be defined here
    Shipment_status.belongsToMany(models.Order,
      {
        through: models.Shipment,
        foreignKey: 'ShipmentStatusId',
        as: 'ShipmentStatusToOrder'

      })


  };
  return Shipment_status;
};
