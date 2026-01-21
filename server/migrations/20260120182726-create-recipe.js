'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING // Karena ID dari API adalah string yang di ambil dari spoonacular API
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true // Ubah dari false ke true agar lebih aman dari API luar
      },
      calories: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      protein: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      fat: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0 
      },
      carbs: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      instructions: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recipes');
  }
};