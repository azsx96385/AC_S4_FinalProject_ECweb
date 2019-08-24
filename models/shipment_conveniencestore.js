'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipment_convenienceStore = sequelize.define('Shipment_convenienceStore', {
    branch: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  Shipment_convenienceStore.associate = function (models) {
    Shipment_convenienceStore.belongsToMany(models.Order,
      {
        through: models.Shipment,
        foreignKey: 'ShipmentConvenienceStoreId',
        as: 'ShipmentConvenienceStoreToOrder'
      })
  };
  return Shipment_convenienceStore;
};