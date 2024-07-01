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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const fs = require('fs');
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'You can\'t access this feature without logging in!' });
    }
    // Get the token from the header
    const token = authHeader.split(' ')[1];
    // Verify the token
    try {
        // Read the public key
        const cert = process.env.SECRET_KEY;
        // Verify the token
        jwt.verify(token, cert, { algorithms: ['HS256'] }, (err, payload) => {
            if (err) {
                console.error('Invalid signature:', err.message);
                // Handle the error
                return res.status(403).json({ message: 'Failed to login' });
            }
            else {
                req.userId = payload.userId;
                next();
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
});
exports.default = isAuth;
