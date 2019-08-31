'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery_notice = sequelize.define('Delivery_notice', {
    ProductId: DataTypes.INTEGER,
    email: DataTypes.STRING
  }, {});
  Delivery_notice.associate = function (models) {
    Delivery_notice.belongsTo(models.Product)
  };
  return Delivery_notice;
};