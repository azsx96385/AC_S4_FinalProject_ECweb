"use strict";
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      StoreCategoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );
  Store.associate = function(models) {
    // associations can be defined here
    Store.hasMany(models.Coupon);
    Store.belongsTo(models.Store_category);
  };
  return Store;
};
