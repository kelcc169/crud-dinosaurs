'use strict';
module.exports = (sequelize, DataTypes) => {
  const possession = sequelize.define('possession', {
    name: DataTypes.STRING,
    dinosaurId: DataTypes.INTEGER
  }, {});
  possession.associate = function(models) {
    // associations can be defined here
    models.possession.belongsTo(models.dinosaur)
  };
  return possession;
};