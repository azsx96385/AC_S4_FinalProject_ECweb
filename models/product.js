"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      ProductCategoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      image: DataTypes.STRING
    },
    {}
  );
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsToMany(models.Cart, {
      as: 'carts',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'ProductId'
    });
    Product.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.Order_item, unique: false
      },
      foreignKey: 'ProductId'
    });
    Product.hasMany(models.Comment);
    Product.hasMany(models.CartItem);
    Product.hasMany(models.Order_item);


  };
  return Product;
};
