import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');
const fs = require('fs');


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
const isAuth = async (req:Request, res:Response, next:NextFunction) => {
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
        jwt.verify(token, cert, { algorithms: ['HS256'] }, (err:any, payload:any) => {
            if (err) {
                console.error('Invalid signature:', err.message);
                // Handle the error
                return res.status(403).json({ message: 'Failed to login' });
            } else {
                req.userId = payload.userId;
                next();
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

export default isAuth;
