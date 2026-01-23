const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NutriGuide AI API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for NutriGuide AI',
      contact: {
        name: 'NutriGuide AI Support',
        email: 'support@nutriguide.ai'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            UserId: { type: 'integer' },
            RecipeId: { type: 'string' },
            title: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  },
  // Mencari anotasi Swagger di dalam folder routes dan controllers
  apis: ['./routes/*.js', './controllers/*.js']
};

module.exports = swaggerJsdoc(options);