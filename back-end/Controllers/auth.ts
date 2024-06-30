import { Request, Response, NextFunction } from "express";
import { User } from "../Models/Index";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { error } from "console";
const { query, validationResult } = require('express-validator');

require('dotenv').config();

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fName, lName, userName, password } = req.body;

        // Check if req.file exists and is defined
        const imageUrl: string | undefined = req.file?.path;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Check if user exists
        const userExists = await User.findOne({ where: { userName } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create user

        const user = new User({ fName, lName, userName, password: hashedPassword, imageUrl });
        await user.save();

        res.status(201).json({ message: "User Created Successfully", user });
    } catch (err) {
        console.error('Error signing up user:', err);
        next(err);
    }
};
const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userName, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ where: { userName } });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }
        // Create and assign token
        const token = await jwt.sign({ userId: user.id, userName: user.userName }, "more super secret key")
        // Return user
        res.status(200).json({ message: 'User Signed In Successfully', token });


    } catch (err) {
        console.log(err);
        next(err);
    }
};

export { signUp, signIn };
