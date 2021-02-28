require('dotenv').config({path:'.env'})

module.exports = {
  development: {
    database: process.env.POSTGRES_DB_WORK,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false
  },
  test: {
    database: process.env.POSTGRES_DB_TEST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false
  },
  production: {}
};