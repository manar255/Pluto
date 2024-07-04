"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.getUser = exports.addFriend = exports.getAllFriend = void 0;
const Index_1 = require("../Models/Index");
const customErrorClass_1 = __importDefault(require("../types/customErrorClass"));
const sequelize_1 = require("sequelize");
require('dotenv').config();
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            const err = new customErrorClass_1.default('Unauthorized access', 401);
            throw err;
        }
        const user = yield Index_1.User.findByPk(userId, {
            attributes: ['id', 'fName', 'lName', 'userName', 'imageUrl'],
        });
        if (!user) {
            const err = new customErrorClass_1.default('User not found', 404);
            throw err;
        }
        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (err) {
        console.log('error in getting user data');
        next(err);
    }
});
exports.getUser = getUser;
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { query } = req.params;
        const current_user = yield Index_1.User.findByPk(userId);
        const userFriends = yield (current_user === null || current_user === void 0 ? void 0 : current_user.getFriends());
        const userFriendsIds = userFriends === null || userFriends === void 0 ? void 0 : userFriends.map((friend) => friend.id);
        const users = yield Index_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { userName: { [sequelize_1.Op.like]: `%${query}%` } },
                    { fName: { [sequelize_1.Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'fName', 'lName', 'userName', 'imageUrl'],
            limit: 10,
        });
        const users_data = users.map(user => {
            //if user is friend to current friend
            const isFriend = userFriendsIds === null || userFriendsIds === void 0 ? void 0 : userFriendsIds.includes(user.id);
            return {
                id: user.id,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                imageUrl: user.imageUrl,
                isFriend: isFriend
            };
        });
        //fliter current user from users data
        const filtered_users_data = users_data.filter(user => user.id !== (current_user === null || current_user === void 0 ? void 0 : current_user.id));
        res.status(200).json({
            status: 'success',
            data: filtered_users_data,
        });
    }
    catch (err) {
        console.log('error in getting user data');
        next(err);
    }
});
exports.searchUser = searchUser;
const getAllFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            const err = new customErrorClass_1.default('Unauthorized access', 401);
            throw err;
        }
        const user = yield Index_1.User.findByPk(userId);
        if (!user) {
            const err = new customErrorClass_1.default('User not found', 404);
            throw err;
        }
        const friends = yield user.getFriends();
        const friends_data = friends.map(friend => {
            return {
                id: friend.id,
                fName: friend.fName,
                lName: friend.lName,
                userName: friend.userName,
                imageUrl: friend.imageUrl
            };
        });
        res.status(200).json({ message: "Success in getting all friends", friends_data });
    }
    catch (err) {
        console.error('Error get user friends:', err);
        next(err);
    }
});
exports.getAllFriend = getAllFriend;
const addFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const friendId = req.params.friendId;
        if (!userId || !friendId) {
            const err = new customErrorClass_1.default('Unauthorized access', 401);
            throw err;
        }
        const user = yield Index_1.User.findByPk(userId);
        const friend = yield Index_1.User.findByPk(friendId);
        if (!user) {
            const err = new customErrorClass_1.default('User not found', 404);
            throw err;
        }
        if (!friend) {
            const err = new customErrorClass_1.default('Friend not found', 404);
            throw err;
        }
        if (user.id === friend.id) {
            const err = new customErrorClass_1.default('You can not add yourself as a friend', 400);
            throw err;
        }
        yield user.addFriend(friend);
        yield friend.addFriend(user);
        //add chat
        const chat = yield Index_1.Chat.create({});
        yield chat.addUsers([user, friend]);
        res.status(200).json({ message: "Success in adding friend" });
    }
    catch (err) {
        console.error('Error add friend:', err);
        next(err);
    }
});
exports.addFriend = addFriend;
