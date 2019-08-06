'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    rating: DataTypes.INTEGER,
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Product)
    Comment.belongsTo(models.User)
  };
  return Comment;
};