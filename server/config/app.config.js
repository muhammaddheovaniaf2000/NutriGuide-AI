/**
 * Application Configuration
 * Centralized configuration management with environment variable validation
 */

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // API Keys
  apiKeys: {
    gemini: process.env.GEMINI_API_KEY,
    spoonacular: process.env.SPOONACULAR_API_KEY,
    unsplash: process.env.UNSPLASH_ACCESS_KEY,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
};

/**
 * Validate required environment variables
 */
function validateConfig() {
  const requiredEnvVars = [
    'JWT_SECRET',
    'DATABASE_URL',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0 && config.server.isProduction) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }

  if (missingVars.length > 0 && config.server.isDevelopment) {
    console.warn('⚠️  Warning: Missing environment variables:', missingVars.join(', '));
    console.warn('   Using default values for development');
  }
}

// Run validation
validateConfig();

module.exports = config;
