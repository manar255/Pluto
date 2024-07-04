import { Sequelize } from "sequelize";
import userModel from './User';
import chatModel from './Chat';
import messageModel from './Message';


import db from '../config/database'

const User = userModel(db);
const Chat = chatModel(db);
const Message = messageModel(db);




// Define associations
User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' ,as: 'Sender'});

Chat.hasMany(Message, { foreignKey: 'chatId' ,as: 'Messages'});
Message.belongsTo(Chat, { foreignKey: 'chatId' ,as: 'Chat'  });

Chat.belongsToMany(User, { through: 'ChatParticipants', as: 'Users', foreignKey: 'chatId', otherKey: 'userId' });
User.belongsToMany(Chat, { through: 'ChatParticipants', as: 'Chats', foreignKey: 'userId', otherKey: 'chatId' });


// Define associations
User.belongsToMany(User, { through: 'UserFriends', as: 'Friends', foreignKey: 'userId', otherKey: 'friendId' });
User.belongsToMany(User, { through: 'UserFriends', as: 'FriendOf', foreignKey: 'friendId', otherKey: 'userId' });


// Sync models with the database
db.sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

export { User, Chat, Message, db };
