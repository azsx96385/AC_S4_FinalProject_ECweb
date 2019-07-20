'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    StoreId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    Coupon_typeId: DataTypes.INTEGER,
    coupon_code: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Coupon.associate = function(models) {
    // associations can be defined here
  };
  return Coupon;
};