const express = require('express');
const MealPlanController = require('../controllers/mealPlans');
const router = express.Router();

/**
 * @swagger
 * /mealplans:
 *   post:
 *     summary: Create a new meal plan
 *     tags: [Meal Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *               - date
 *               - meal_time
 *             properties:
 *               recipeId:
 *                 type: string
 *                 example: "716429"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-25"
 *               meal_time:
 *                 type: string
 *                 enum: [Breakfast, Lunch, Dinner]
 *                 example: Breakfast
 *     responses:
 *       201:
 *         description: Meal plan created successfully
 */
router.post('/', MealPlanController.createMealPlan);

/**
 * @swagger
 * /mealplans:
 *   get:
 *     summary: Get all user meal plans
 *     tags: [Meal Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of meal plans retrieved
 */
router.get('/', MealPlanController.getAllMealPlans);

/**
 * @swagger
 * /mealplans/{id}:
 *   delete:
 *     summary: Remove a meal plan by ID
 *     tags: [Meal Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal plan removed
 */
router.delete('/:id', MealPlanController.removeMealPlan);

module.exports = router;