require('dotenv').config();
const { Sequelize } = require('sequelize');

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT;

const URI = `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const sequelize = new Sequelize(URI, { dialect: 'postgres', logging: false });

module.exports = sequelize;
