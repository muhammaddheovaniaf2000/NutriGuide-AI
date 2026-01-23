const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const recipeRoutes = require('./recipe');
const mealPlanRoutes = require('./mealPlan'); // Pastikan huruf besar/kecil sesuai nama file
const favoriteRoutes = require('./favorite');
const aiRoutes = require('./ai');

// MIDDLEWARES
const authentication = require('../middlewares/authentication');
const errorHandler = require('../middlewares/errorHandler');
const RecipeController = require('../controllers/recipe');

/**
 * @swagger
 * /pub/recipes:
 * get:
 * summary: Search recipes (Public)
 * tags: [Recipes]
 * parameters:
 * - in: query
 * name: search
 * schema: { type: string }
 * responses:
 * 200:
 * description: List of recipes
 */
router.get('/pub/recipes', RecipeController.searchRecipes); 

/**
 * @swagger
 * /pub/recipes/{id}:
 * get:
 * summary: Get recipe details (Public)
 * tags: [Recipes]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * responses:
 * 200:
 * description: Recipe details
 */
router.get('/pub/recipes/:id', RecipeController.detailRecipe);

// RUTE USER (Register & Login biasanya di sini)
router.use('/', userRoutes);

// ? MIDDLEWARE AUTHENTICATION
// Semua rute di bawah ini memerlukan Header: Authorization Bearer <token>
router.use(authentication);

router.use('/recipes', recipeRoutes);
router.use('/mealplans', mealPlanRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/ai', aiRoutes);

// MIDDLEWARE ERROR HANDLER (Harus paling bawah)
router.use(errorHandler);

module.exports = router;