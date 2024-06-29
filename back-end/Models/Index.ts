import { Sequelize } from "sequelize";
import userModel from './User';
import chatModel from './Chat';
import messageModel from './Message';

import db from '../config/database'

const User = userModel(db);
const Chat = chatModel(db);
const Message = messageModel(db);


// Define associations
User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

Chat.belongsToMany(User, { through: 'ChatParticipants' });
User.belongsToMany(Chat, { through: 'ChatParticipants' });

User.belongsToMany(User,{ through: 'UserFriends', as: 'Friends', foreignKey: 'userId', otherKey: 'friendId' });

// Sync models with the database
db.sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

export { User, Chat, Message, db };
