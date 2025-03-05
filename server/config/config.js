// config.js is a configuration file that exports an object 
// with the configuration options for the application. 
// The configuration object contains the database URI and 
// the JWT_SECRET environment variable.

// Import necessary modules
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Dynamically load the configuration file based on NODE_ENV
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    db: process.env.MONGO_URI || 'mongodb://localhost:27017/team-project-management',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    cookieExpire: parseInt(process.env.COOKIE_EXPIRE) || 30,
  },
};

// Export the configuration for the current environment
module.exports = config[env];