"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      StoreId: DataTypes.INTEGER,
      role: DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      emailVerf: DataTypes.INTEGER,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      image: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Comment);
    User.hasMany(models.Order);
    User.belongsToMany(models.Coupon, {
      as: "UserCoupon",
      through: {
        model: models.CouponsUsers,
        unique: true
      },
      foreignKey: "UserId"
    });
  };
  return User;
};
