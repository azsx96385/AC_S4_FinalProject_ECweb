"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payment_type = sequelize.define(
    "Payment_type",
    {
      paymentType: DataTypes.STRING
    },
    {}
  );
  Payment_type.associate = function(models) {
    // associations can be defined here
    Payment_type.hasMany(models.Payment);
  };
  return Payment_type;
};
