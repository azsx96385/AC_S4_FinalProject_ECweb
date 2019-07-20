'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    OrderId: DataTypes.INTEGER,
    Payment_statusId: DataTypes.INTEGER,
    Payment_typeId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
  };
  return Payment;
};