"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shipment_type = sequelize.define(
    "Shipment_type",
    {
      shipmentType: DataTypes.STRING
    },
    {}
  );
  Shipment_type.associate = function (models) {
    // associations can be defined here
    Shipment_type.belongsToMany(models.Order,
      {
        through: models.Shipment,
        foreginKey: 'ShipmentTypeId',
        as: 'ShipmentTypeToOrder'

      })

  };
  return Shipment_type;
};
