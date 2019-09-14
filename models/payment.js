"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      OrderId: DataTypes.INTEGER,
      PaymentStatusId: DataTypes.INTEGER,
      PaymentTypeId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER
    },
    {}
  );
  Payment.associate = function (models) {
    // Payment.belongsTo(models.Order);
    Payment.belongsTo(models.Order);
    Payment.belongsTo(models.Payment_status);
    Payment.belongsTo(models.Payment_type);
  };
  return Payment;
};
