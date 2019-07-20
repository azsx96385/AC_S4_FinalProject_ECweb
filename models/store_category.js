'use strict';
module.exports = (sequelize, DataTypes) => {
  const Store_category = sequelize.define('Store_category', {
    name: DataTypes.STRING
  }, {});
  Store_category.associate = function(models) {
    // associations can be defined here
  };
  return Store_category;
};