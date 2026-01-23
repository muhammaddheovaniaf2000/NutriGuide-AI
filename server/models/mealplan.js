'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MealPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MealPlan.belongsTo(models.User, { foreignKey: 'UserId' });
      // RecipeId is a string reference to external API, not a DB relationship
    }
  }
  MealPlan.init({
    UserId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    RecipeId: {
      type:DataTypes.STRING,
      allowNull: false,
      references: null  // Explicitly no foreign key
    },
    date: {
      type:DataTypes.DATEONLY,
      allowNull: false,
    },
    meal_time: {
      type:DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'MealPlan',
  });
  return MealPlan;
};