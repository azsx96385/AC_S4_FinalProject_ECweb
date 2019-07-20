'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product_category = sequelize.define('Product_category', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  Product_category.associate = function(models) {
    // associations can be defined here
  };
  return Product_category;
};