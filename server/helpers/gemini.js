const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pastikan GEMINI_API_KEY di .env tidak menggunakan tanda petik
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview" 
});

module.exports = model;