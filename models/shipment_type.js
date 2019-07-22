"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shipment_type = sequelize.define(
    "Shipment_type",
    {
      shipmentType: DataTypes.STRING
    },
    {}
  );
  Shipment_type.associate = function(models) {
    // associations can be defined here
  };
  return Shipment_type;
};
