const express = require('express');
const RecipeController = require('../controllers/recipe');
const router = express.Router()



//? ENDPOINTS INI MENJADI JEMBATAN KE API 
router.get('/', RecipeController.searchRecipes)
router.get('/:id', RecipeController.detailRecipe)



module.exports = router;




