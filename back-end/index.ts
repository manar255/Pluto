import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import db from './config/database';
import CustomError from './types/customError';
import path from 'path';

import authRouter from './Routers/auth';
import userRouter from './Routers/user';
import chatRouter from './Routers/chat';

dotenv.config();
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')));

 const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to your needs
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

// Socket.IO setup
export const userSocketMap: { [key: string]: string } = {};
io.on('connection', (socket) => {
    console.log('a user connected');
    
    let userId: string |string[] = socket.handshake.query.userId || 'lol';
    if (Array.isArray(userId)) {
        userId = userId[0];
    }
    
    userSocketMap[userId] = socket.id;
    console.log('user joined', userSocketMap);


	
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

    
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user-disconnected', userId);
        delete userSocketMap[userId];
    });
});

// Error handling
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({ message });
};
app.use(errorHandler);

// Database connection
db.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch(error => {
        console.error('Error syncing database', error);
    });

server.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
