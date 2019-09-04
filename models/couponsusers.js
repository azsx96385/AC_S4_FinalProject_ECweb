'use strict';
module.exports = (sequelize, DataTypes) => {
  const CouponsUsers = sequelize.define('CouponsUsers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: DataTypes.INTEGER,
    CouponId: DataTypes.INTEGER,
    counts: DataTypes.INTEGER
  }, {});
  CouponsUsers.associate = function (models) {
    // associations can be defined here
  };
  return CouponsUsers;
};