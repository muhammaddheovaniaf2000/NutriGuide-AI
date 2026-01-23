const { Favorite, Recipe } = require('../models');

class FavoriteController {
    static async addFavorite(req, res, next) {
        try {
            const { recipeId, title, image, description } = req.body;
            const userId = req.user.id; 
            if (!recipeId) {
                throw { name: "BadRequest", message: "Recipe ID is required" };
            }

           const [favorite, created] = await Favorite.findOrCreate({
                where: { UserId: userId, RecipeId: String(recipeId) },
                defaults: { 
                    title: title || "No Title", 
                    image: image || "", 
                    description: description || ""
                 }
            });

            if (!created) {
                throw { name: "BadRequest", message: "Recipe already in favorites" };
            }

            res.status(201).json({
                message: "Recipe added to favorites",
                favorite
            });
        } catch (error) {
            console.log(error, "CEK ERROR ADD FAVORITE");
            next(error);
        }
    }

    static async getFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const favorites = await Favorite.findAll({
                where: { UserId: userId },
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json(favorites);
        } catch (error) {
            next(error);
        }
    }

    static async removeFavorite(req, res, next) {
        try {
            const { id } = req.params; 
            const userId = req.user.id;

            const favorite = await Favorite.findOne({
                where: { id, UserId: userId }
            });

            if (!favorite) {
                throw { name: "NotFound", message: "Favorite record not found" };
            }

            await favorite.destroy();

            res.status(200).json({
                message: `Favorite with id ${id} has been removed`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FavoriteController;