const model = require('../helpers/gemini');
const spoonacular = require('../helpers/spoonacular');

class AIController {
    /**
     * Handle Nutrition Recommendation
     * Gabungan analisis AI Gemini dan data resep Spoonacular
     */
    static async getRecommendation(req, res, next) {
        try {
            const { weight, height, age, gender, goal } = req.body;

            // 1. Validasi Input
            if (!weight || !height || !age || !gender || !goal) {
                throw { name: "BadRequest", message: "Health metrics form must be fully completed" };
            }

            // 2. Siapkan Prompt untuk AI
            const prompt = `
              Analyze: ${gender}, ${age} years old, ${weight}kg, ${height}cm. Goal: ${goal}.
              Return ONLY a JSON object with this structure:
              {
                "health_metrics": { "bmi": 0, "bmi_category": "", "daily_calories_target": 0 },
                "macros": { "protein_grams": 0, "carbs_grams": 0, "fat_grams": 0 },
                "meal_distribution": { "breakfast_kcal": 0, "lunch_kcal": 0, "dinner_kcal": 0 },
                "dietary_advice": "short advice string",
                "recipe_queries": ["healthy food query"]
              }
            `;

            // 3. Panggil Helper Gemini (Versi Axios)
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // 4. Parsing JSON dari AI (mengambil bagian di antara { dan })
            const startBracket = text.indexOf('{');
            const endBracket = text.lastIndexOf('}');
            
            if (startBracket === -1 || endBracket === -1) {
                throw { name: "InternalServerError", message: "AI failed to provide valid analysis" };
            }

            const aiData = JSON.parse(text.substring(startBracket, endBracket + 1));

            // 5. Panggil Spoonacular API menggunakan saran query dari AI
            const { data } = await spoonacular.get('/recipes/complexSearch', {
                params: {
                    query: aiData.recipe_queries[0] || 'healthy food',
                    number: 6,
                    addRecipeInformation: true,
                    fillIngredients: true,
                    // Batasi kalori berdasarkan saran makan siang dari AI
                    maxCalories: aiData.meal_distribution.lunch_kcal || 800 
                }
            });

            // 6. Kirim Response Final
            res.status(200).json({
                ai_analysis: aiData,
                recommended_recipes: data.results
            });
            
        } catch (error) {
            console.error("--- ERROR DI CONTROLLER AI ---", error);
            next(error);
        }
    }

    /**
     * Handle Chat dengan Assistant
     */
    static async chatWithAI(req, res, next) {
        try {
            const { message } = req.body;

            if (!message) {
                throw { name: "BadRequest", message: "Message is required" };
            }

            // Tambahkan instruksi agar AI menjawab sebagai pakar nutrisi
            const chatPrompt = `You are a helpful NutriGuide AI assistant. Answer this concisely: ${message}`;

            const result = await model.generateContent(chatPrompt);
            const reply = result.response.text();

            res.status(200).json({
                reply: reply.trim()
            });
        } catch (error) {
            console.error("--- ERROR DI CHAT AI ---", error);
            next(error);
        }
    }
}

module.exports = AIController;