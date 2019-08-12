"use strict";
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      StoreCategoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );
  Store.associate = function (models) {
    // associations can be defined here
    Store.hasMany(models.Coupon)
  };
  return Store;
};
