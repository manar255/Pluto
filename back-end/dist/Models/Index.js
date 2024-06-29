"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Message = exports.Chat = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
const Chat_1 = __importDefault(require("./Chat"));
const Message_1 = __importDefault(require("./Message"));
const database_1 = __importDefault(require("../config/database"));
exports.db = database_1.default;
const User = (0, User_1.default)(database_1.default);
exports.User = User;
const Chat = (0, Chat_1.default)(database_1.default);
exports.Chat = Chat;
const Message = (0, Message_1.default)(database_1.default);
exports.Message = Message;
// Define associations
User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });
Chat.belongsToMany(User, { through: 'ChatParticipants' });
User.belongsToMany(Chat, { through: 'ChatParticipants' });
User.belongsToMany(User, { through: 'UserFriends', as: 'Friends', foreignKey: 'userId', otherKey: 'friendId' });
// Sync models with the database
database_1.default.sync({ force: false })
    .then(() => {
    console.log("Database & tables created!");
})
    .catch((error) => {
    console.error("Error creating database tables:", error);
});
