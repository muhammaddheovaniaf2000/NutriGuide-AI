'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove foreign key constraints from MealPlans and Favorites
    // RecipeId is just a string reference to external API, not a real DB relationship
    try {
      await queryInterface.removeConstraint('MealPlans', 'MealPlans_RecipeId_fkey');
    } catch (error) {
      console.log('MealPlans constraint might not exist');
    }
    
    try {
      await queryInterface.removeConstraint('Favorites', 'Favorites_RecipeId_fkey');
    } catch (error) {
      console.log('Favorites constraint might not exist');
    }
  },

  async down (queryInterface, Sequelize) {
    // Add them back if needed
    await queryInterface.addConstraint('MealPlans', {
      fields: ['RecipeId'],
      type: 'foreign key',
      name: 'MealPlans_RecipeId_fkey',
      references: {
        table: 'Recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    await queryInterface.addConstraint('Favorites', {
      fields: ['RecipeId'],
      type: 'foreign key',
      name: 'Favorites_RecipeId_fkey',
      references: {
        table: 'Recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
