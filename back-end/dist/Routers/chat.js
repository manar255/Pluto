"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { query , body }from 'express-validator'
const router = express_1.default.Router();
const chat_1 = require("../Controllers/chat");
const isAuth_1 = __importDefault(require("../Middlewares/isAuth"));
router.get('/getUserChats', isAuth_1.default, chat_1.getUserChats);
router.get('/getMessages/:chatId', isAuth_1.default, chat_1.getMessages);
router.post('/sendMessage/:chatId', isAuth_1.default, chat_1.sendMessage);
exports.default = router;
