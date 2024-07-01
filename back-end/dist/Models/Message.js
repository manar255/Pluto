"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Define the model class
class Message extends sequelize_1.Model {
}
exports.default = (db) => {
    Message.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: sequelize_1.DataTypes.STRING,
        senderId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false // Assuming senderId cannot be null
        }
    }, {
        sequelize: db, // passing the `sequelize` instance is required
        modelName: 'Message',
        timestamps: true,
    });
    return Message;
};
