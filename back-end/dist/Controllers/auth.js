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
exports.signUp = void 0;
const Index_1 = require("../Models/Index");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fName, lName, userName, password } = req.body;
        // Check if req.file exists and is defined
        const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Please upload an image' });
        }
        const user = new Index_1.User({ fName, lName, userName, password, imageUrl });
        yield user.save();
        res.status(201).json({ message: "User Created Successfully", user });
    }
    catch (err) {
        console.error('Error signing up user:', err);
        next(err);
    }
});
exports.signUp = signUp;
