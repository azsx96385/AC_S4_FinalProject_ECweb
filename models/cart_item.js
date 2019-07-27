'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart_item = sequelize.define('Cart_item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProductId: DataTypes.INTEGER,
    CartId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  Cart_item.associate = function (models) {
    // associations can be defined here
    Cart_item.belongsTo(models.Cart);
    Cart_item.belongsTo(models.Product);



  };
  return Cart_item;
};