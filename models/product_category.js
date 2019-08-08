"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product_category = sequelize.define(
    "Product_category",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      StoreId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      image: DataTypes.STRING
    },
    {}
  );
  Product_category.associate = function(models) {
    Product_category.hasMany(models.Product);
  };
  return Product_category;
};
