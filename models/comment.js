'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.Product);
    Comment.belongsTo(models.User)
  };
  return Comment;
};