"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payment_status = sequelize.define(
    "Payment_status",
    {
      paymentStatus: DataTypes.STRING
    },
    {}
  );
  Payment_status.associate = function(models) {
    // associations can be defined here
  };
  return Payment_status;
};
