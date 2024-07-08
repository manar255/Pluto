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
exports.signIn = exports.signUp = void 0;
const Index_1 = require("../Models/Index");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'not found';
const JWT_EXPIRE = process.env.JWT_EXPIRE;
const { query, validationResult } = require('express-validator');
// require('dotenv').config();
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fName, lName, userName, password } = req.body;
        // Check if req.file exists and is defined
        const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Please upload an image' });
        }
        // Check if user exists
        const userExists = yield Index_1.User.findOne({ where: { userName } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = new Index_1.User({ fName, lName, userName, password: hashedPassword, imageUrl });
        yield user.save();
        res.status(201).json({ message: "User Created Successfully", user });
    }
    catch (err) {
        console.error('Error signing up user:', err);
        next(err);
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userName, password } = req.body;
        // Check if user exists
        const user = yield Index_1.User.findOne({ where: { userName } });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // Check if password is correct
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }
        // Create and assign token
        const token = yield jsonwebtoken_1.default.sign({ userId: user.id, userName: user.userName }, SECRET_KEY, { expiresIn: JWT_EXPIRE });
        // Return user
        res.status(200).json({ message: 'User Signed In Successfully', token });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.signIn = signIn;
