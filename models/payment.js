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
  Payment.associate = function (models) {
    Payment.belongsTo(models.Order)
  };
  return Payment;
};
