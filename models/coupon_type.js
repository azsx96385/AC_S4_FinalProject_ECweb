'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon_type = sequelize.define('Coupon_type', {
    coupon_type: DataTypes.STRING
  }, {});
  Coupon_type.associate = function(models) {
    // associations can be defined here
  };
  return Coupon_type;
};