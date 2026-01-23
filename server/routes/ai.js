const express = require('express');
const AIController = require('../controllers/ai');
const router = express.Router();

/**
 * @swagger
 * /ai/recommendation:
 *   post:
 *     summary: Get AI-powered nutrition recommendation
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: integer
 *                 example: 70
 *               height:
 *                 type: integer
 *                 example: 175
 *               age:
 *                 type: integer
 *                 example: 25
 *               gender:
 *                 type: string
 *                 example: Male
 *               goal:
 *                 type: string
 *                 example: Weight Loss
 *     responses:
 *       200:
 *         description: AI Recommendation generated
 */
router.post('/recommendation', AIController.getRecommendation);

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Chat with NutriGuide AI assistant
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: Is salmon good for omega-3?
 *     responses:
 *       200:
 *         description: AI Response
 */
 
router.post('/chat', AIController.chatWithAI);

module.exports = router;