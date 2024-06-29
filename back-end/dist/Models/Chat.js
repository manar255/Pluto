"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Define the model class
class Chat extends sequelize_1.Model {
}
exports.default = (db) => {
    Chat.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    }, {
        sequelize: db, // passing the `sequelize` instance is required
        modelName: 'Chat',
        timestamps: true,
    });
    return Chat;
};
