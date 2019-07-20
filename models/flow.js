'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flow = sequelize.define('Flow', {
    StoreId: DataTypes.INTEGER,
    device: DataTypes.STRING,
    browser: DataTypes.STRING
  }, {});
  Flow.associate = function(models) {
    // associations can be defined here
  };
  return Flow;
};