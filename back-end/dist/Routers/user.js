"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { query , body }from 'express-validator'
const router = express_1.default.Router();
const user_1 = require("../Controllers/user");
const isAuth_1 = __importDefault(require("../Middlewares/isAuth"));
router.get('/getAllFriends', isAuth_1.default, user_1.getAllFriend);
router.put('/addFriend/:friendId', isAuth_1.default, user_1.addFriend);
exports.default = router;
