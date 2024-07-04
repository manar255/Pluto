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
exports.sendMessage = exports.getMessages = exports.getUserChats = void 0;
const Index_1 = require("../Models/Index");
const customErrorClass_1 = __importDefault(require("../types/customErrorClass"));
const sequelize_1 = require("sequelize");
// import User from "../Models/User";
require('dotenv').config();
const getUserChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new customErrorClass_1.default('User not found', 400);
        }
        const user = yield Index_1.User.findByPk(userId, {
            attributes: ['username'],
            include: [
                {
                    model: Index_1.Chat,
                    as: 'Chats',
                    attributes: ['id', 'updatedAt'],
                    include: [
                        {
                            model: Index_1.User,
                            as: 'Users',
                            where: {
                                id: {
                                    [sequelize_1.Op.not]: userId
                                }
                            },
                            attributes: ['id', 'username', 'fName', 'lName', 'imageUrl'],
                            through: { attributes: [] }
                        },
                        {
                            model: Index_1.Message,
                            as: 'Messages',
                            attributes: ['id', 'content', 'createdAt'], // Adjust attributes as per your requirements
                            // include: [
                            //     {
                            //         model: User,
                            //         as: 'Sender',
                            //         attributes: ['id', 'username'] // Adjust attributes as per your requirements
                            //     }
                            // ],
                            order: [['createdAt', 'DESC']], // Order messages by createdAt DESC to get the last message
                            limit: 1 // Limit to 1 message to get the last message only
                        }
                    ],
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json({ message: "Success in getting all chats", user });
    }
    catch (err) {
        console.log('error in getting all user chats');
        next(err);
    }
});
exports.getUserChats = getUserChats;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const chatId = req.params.chatId;
        if (!chatId) {
            throw new customErrorClass_1.default('Chat not found', 400);
        }
        const chat = yield Index_1.Chat.findByPk(chatId, {
            include: [
                {
                    model: Index_1.Message,
                    as: 'Messages',
                    attributes: ['id', 'content', 'createdAt'],
                    include: [
                        {
                            model: Index_1.User,
                            as: 'Sender',
                            attributes: ['id', 'username']
                        }
                    ],
                    // order: [['createdAt', 'ASC']]
                },
                {
                    model: Index_1.User,
                    as: 'Users',
                    attributes: ['id', 'username'],
                    where: {
                        id: { [sequelize_1.Op.not]: userId }
                    }
                }
            ]
        });
        res.status(200).json({ message: "Success in getting all messages", chat });
    }
    catch (err) {
        console.log('error in getting all user chats');
        next(err);
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const chatId = req.params.chatId;
        const content = req.body.content;
        if (!chatId) {
            throw new customErrorClass_1.default('Chat not found', 400);
        }
        // Create new message
        const newMessage = yield Index_1.Message.create({
            content,
            senderId: userId,
        });
        //add sender
        // Add message to chat
        const chat = yield Index_1.Chat.findByPk(chatId);
        yield (chat === null || chat === void 0 ? void 0 : chat.addMessage(newMessage));
        res.status(201).json({ message: "Message created successfully", newMessage });
    }
    catch (err) {
        console.log('error in getting all user chats');
        next(err);
    }
});
exports.sendMessage = sendMessage;
