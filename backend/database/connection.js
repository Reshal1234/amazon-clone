// Libraries
const { Sequelize } = require('sequelize');

// TiDB Cloud always requires SSL
const useSsl = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com');

// Database Configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
    logging: false,
    dialectOptions: useSsl ? {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test Database Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = { sequelize, connectDB };