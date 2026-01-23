'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Recipe model is not actually used in the database
      // RecipeId in MealPlan and Favorite are string references to external API
      // Recipe.hasMany(models.MealPlan, { foreignKey: 'RecipeId' });
      // Recipe.belongsToMany(models.User, { through: models.Favorite, foreignKey: 'RecipeId', otherKey: 'UserId' });
    }
  }
  Recipe.init({
    id: { 
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    image_url: DataTypes.STRING,
    calories: {
      type:DataTypes.FLOAT,
      allowNull: false,
    },
    protein: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,
    instructions: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};