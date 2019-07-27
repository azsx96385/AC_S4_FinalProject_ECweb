"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    ProductCategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  Product.associate = function (models) {
    Product.belongsTo(models.Product_category)
    Product.hasMany(models.Comment)
  };
  return Product;
};
