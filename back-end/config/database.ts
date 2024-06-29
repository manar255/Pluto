import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

export default new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
