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
exports.addFriend = exports.getAllFriend = void 0;
const Index_1 = require("../Models/Index");
const customErrorClass_1 = __importDefault(require("../types/customErrorClass"));
require('dotenv').config();
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
