'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.belongsTo(models.User, { foreignKey: 'UserId' });  
      // RecipeId is a string reference to external API, not a DB relationship
    }
  }
  Favorite.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RecipeId: {
      type: DataTypes.STRING, 
      allowNull: false,
      references: null  // Explicitly no foreign key
    },
    title: DataTypes.STRING,   
    image: DataTypes.STRING,   
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};