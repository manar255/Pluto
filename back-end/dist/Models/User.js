"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Define the model class
class User extends sequelize_1.Model {
}
exports.default = (db) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'validation error',
                msg: 'userName already exists',
            },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize: db, // passing the `sequelize` instance is required
        modelName: 'User',
        timestamps: true,
    });
    return User;
};
