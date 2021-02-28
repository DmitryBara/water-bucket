const Sequelize = require('sequelize');
const NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config.js')[NODE_ENV];

const database = new Sequelize(config.database, config.username, config.password, config);

module.exports = database;
