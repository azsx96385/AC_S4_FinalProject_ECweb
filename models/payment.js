"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      OrderId: DataTypes.INTEGER,
      PaymentStatusId: DataTypes.INTEGER,
      PaymentTypeId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER
    },
    {}
  );
  Payment.associate = function(models) {
    // Payment.belongsTo(models.Order);
    Payment.belongsTo(models.Order);
    Payment.belongsTo(models.Payment_status);
    Payment.belongsTo(models.Payment_type);
  };
  return Payment;
};
