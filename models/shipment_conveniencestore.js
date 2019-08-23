'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipment_convenienceStore = sequelize.define('Shipment_convenienceStore', {
    branch: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  Shipment_convenienceStore.associate = function (models) {
    // associations can be defined here
  };
  return Shipment_convenienceStore;
};