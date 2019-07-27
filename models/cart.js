'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {

  }, {});
  Cart.associate = function (models) {
    // associations can be defined here
    Cart.belongsToMany(models.Product, {
      as: 'items',
      through: {
        model: models.Cart_item, unique: false
      },
      foreignKey: 'CartId'
    });
    Cart.hasMany(models.Cart_item)
  };
  return Cart;
};