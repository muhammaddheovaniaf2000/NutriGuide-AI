const { MealPlan } = require('../models');

class MealPlanController {
    static async createMealPlan(req, res, next) {
        try {
            const { recipeId, date, meal_time } = req.body;
            const userId = req.user.id;

            if (!recipeId || !date || !meal_time) {
                throw { name: "BadRequest", message: "Recipe ID, date, and meal time are required" };
            }

            const newMealPlan = await MealPlan.create({
                UserId: userId,
                RecipeId: String(recipeId),
                date,      // Format: YYYY-MM-DD
                meal_time  // Contoh: "Breakfast", "Lunch", atau "Dinner"
            });

            res.status(201).json({
                message: "Meal plan created successfully",
                newMealPlan
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllMealPlans(req, res, next) {
        try {
            const userId = req.user.id;
            const plans = await MealPlan.findAll({
                where: { UserId: userId },
                order: [['date', 'ASC'], ['meal_time', 'ASC']]
            });

            res.status(200).json(plans);
        } catch (error) {
            next(error);
        }
    }

    static async removeMealPlan(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const plan = await MealPlan.findOne({ where: { id, UserId: userId } });

            if (!plan) {
                throw { name: "NotFound", message: "Meal plan not found" };
            }

            await plan.destroy();
            res.status(200).json({ message: "Meal plan removed successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MealPlanController;