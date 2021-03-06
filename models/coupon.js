"use strict";
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      StoreId: DataTypes.INTEGER,
      CouponTypeId: DataTypes.INTEGER,
      couponCode: DataTypes.STRING,
      discount: DataTypes.INTEGER,
      description: DataTypes.STRING,
      available: DataTypes.BOOLEAN,
      expireDate: DataTypes.DATE,
    },
    {}
  );
  Coupon.associate = function (models) {
    // associations can be defined here
    Coupon.belongsToMany(models.User, {
      as: 'CouponUser',
      through: {
        model: models.CouponsUsers
      },
      foreignKey: 'CouponId'
    });

    Coupon.belongsTo(models.Coupon_type);
    Coupon.belongsTo(models.Store);

  };
  return Coupon;
};
