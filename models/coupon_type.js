"use strict";
module.exports = (sequelize, DataTypes) => {
  const Coupon_type = sequelize.define(
    "Coupon_type",
    {
      couponType: DataTypes.STRING
    },
    {}
  );
  Coupon_type.associate = function (models) {
    // associations can be defined here
    Coupon_type.hasMany(models.Coupon)
  };
  return Coupon_type;
};
