"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./config/database"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./Routers/auth"));
const user_1 = __importDefault(require("./Routers/user"));
const chat_1 = __importDefault(require("./Routers/chat"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust this to your needs
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 5000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Routers
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/chat', chat_1.default);
// Socket.IO setup
const userSocketMap = {};
io.on('connection', (socket) => {
    console.log('a user connected');
    let userId = socket.handshake.query.userId || 'lol';
    if (Array.isArray(userId)) {
        userId = userId[0];
    }
    userSocketMap[userId] = socket.id;
    console.log('user joined', userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on('chat message', data => {
        io.emit('chat message', data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user-disconnected', userId);
        delete userSocketMap[userId];
    });
});
// Error handling
const errorHandler = (error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({ message });
};
app.use(errorHandler);
// Database connection
database_1.default.authenticate()
    .then(() => {
    console.log('Database connected');
})
    .catch(error => {
    console.error('Error syncing database', error);
});
server.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
