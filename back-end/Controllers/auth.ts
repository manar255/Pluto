import { Request, Response, NextFunction } from "express";
import { User } from "../Models/Index";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fName, lName, userName, password } = req.body;

        // Check if req.file exists and is defined
        const imageUrl: string | undefined = req.file?.path;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const user = new User({ fName, lName, userName, password, imageUrl });
        await user.save();

        res.status(201).json({ message: "User Created Successfully", user });
    } catch (err) {
        console.error('Error signing up user:', err);
        next(err);
    }
};

export { signUp };
