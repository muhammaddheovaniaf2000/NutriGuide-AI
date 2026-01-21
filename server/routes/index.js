const express = require('express')
const router = express.Router()
const userRoutes = require('./user')
const recipeRoutes = require('./recipe')
const mealPlanRoutes = require('./mealPlan')
const favoriteRoutes = require('./favorite')
const aiRoutes = require('./ai');


//MIDDLEWARES
const authentication = require('../middlewares/authentication')
const errorHandler = require('../middlewares/errorHandler')


// PUBLIC SITE
// router.get('/pub/recipes', RecipeController.publicRecipes)

router.use('/', userRoutes)

//? HARUS MELAKUKAN LOGIN UNTUK MENGAKSES ENDPOINT DI BAWAH INI
router.use(authentication)

router.use('/recipes', recipeRoutes)
router.use('/mealplans', mealPlanRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/ai', aiRoutes)




//MIDDLEWARE ERROR HANDLER
router.use(errorHandler)

module.exports = router;    