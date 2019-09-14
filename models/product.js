"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      ProductCategoryId: DataTypes.INTEGER,
      StoreId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      count: DataTypes.INTEGER,
      launched: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      imageI: DataTypes.STRING,
      imageII: DataTypes.STRING,
    },
    {}
  );
  Product.associate = function (models) {
    Product.belongsTo(models.Product_category);
    Product.hasMany(models.Comment);
    Product.hasMany(models.Cart_item);
    Product.hasMany(models.Order_item);
    Product.hasMany(models.Delivery_notice);
    Product.belongsToMany(models.Cart, {
      as: "carts",
      through: {
        model: models.Cart_item,
        unique: false
      },
      foreignKey: "ProductId"
    });
    Product.belongsToMany(models.Order, {
      as: "orders",
      through: {
        model: models.Order_item,
        unique: false
      },
      foreignKey: "ProductId"
    });
  };
  return Product;
};
