const spoonacular = require('../helpers/spoonacular');

class RecipeController {
    static async searchRecipes(req, res, next) {
        try {
            const { query } = req.query; 
            
            const response = await spoonacular.get('/recipes/complexSearch', {
                params: {
                    query: query || '',
                    number: 10, 
                    addRecipeInformation: true,
                    fillIngredients: true
                }
            });

            res.status(200).json(response.data.results);
        } catch (error) {
            next(error);
        }
    }
}


module.exports = RecipeController;