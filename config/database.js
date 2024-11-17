const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: '127.0.0.1',  // Changed from localhost to 127.0.0.1
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306
    }
);

module.exports = sequelize;