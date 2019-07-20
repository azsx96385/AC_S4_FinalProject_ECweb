'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define('Shipment', {
    OrderId: DataTypes.INTEGER,
    Shipment_statusId: DataTypes.INTEGER,
    Shipment_typeId: DataTypes.INTEGER
  }, {});
  Shipment.associate = function(models) {
    // associations can be defined here
  };
  return Shipment;
};