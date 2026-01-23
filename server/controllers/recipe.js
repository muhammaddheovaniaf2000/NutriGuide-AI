const spoonacular = require('../helpers/spoonacular');

class RecipeController {
    static async searchRecipes(req, res, next) {
        try {
            const { query, diet, cuisine } = req.query; 
            
            const response = await spoonacular.get('/recipes/complexSearch', {
                params: {
                    query: query || '',
                    diet: diet,
                    cuisine: cuisine,
                    number: 12, // Ambil 12 resep agar tampilan grid di frontend bagus
                    addRecipeInformation: true,
                    fillIngredients: true
                }
            });

            // Spoonacular mengembalikan data di dalam response.data.results
            res.status(200).json(response.data.results);
        } catch (error) {
            console.log(error, "<<< Error Search Recipes");
            next(error);
        }
    }



    static async detailRecipe(req, res, next) {
        try {
            const { id } = req.params; // Mengambil ID dari URL parameter
    
            const response = await spoonacular.get(`/recipes/${id}/information`, {
                params: {
                    includeNutrition: true // Agar dapat data kalori & nutrisi lengkap
                }
            });
    
            res.status(200).json(response.data);
        } catch (error) {
            console.log(error, "<<< Error Detail Recipe");
            next(error);
        }
    }
}


module.exports = RecipeController;