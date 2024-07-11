import { Request, Response, NextFunction } from "express";
import { Chat, Message, User, db } from "../Models/Index";
import CustomErrorClass from '../types/customErrorClass'
import { Op } from 'sequelize';
import { io, userSocketMap , } from '../index'

// import User from "../Models/User";

require('dotenv').config();

const getUserChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new CustomErrorClass('User not found', 400);
        }

        const user = await User.findByPk(userId, {
            attributes: ['username'],
            include: [
                {
                    model: Chat,
                    as: 'Chats',
                    attributes: ['id', 'updatedAt'],
                    include: [
                        {
                            model: User,
                            as: 'Users',
                            where: {
                                id: {
                                    [Op.not]: userId
                                }
                            },
                            attributes: ['id', 'username', 'fName', 'lName', 'imageUrl'],
                            through: { attributes: [] }
                        },
                        {
                            model: Message,
                            as: 'Messages',
                            attributes: ['id', 'content', 'createdAt'], // Adjust attributes as per your requirements
                            // include: [
                            //     {
                            //         model: User,
                            //         as: 'Sender',
                            //         attributes: ['id', 'username'] // Adjust attributes as per your requirements
                            //     }
                            // ],
                            order: [['createdAt', 'DESC']], // Order messages by createdAt DESC to get the last message
                            limit: 1 // Limit to 1 message to get the last message only
                        }
                    ],
                    through: { attributes: [] }
                }
            ]
        });

        res.status(200).json({ message: "Success in getting all chats", user });

    } catch (err) {
        console.log('error in getting all user chats')
        next(err);
    }
};

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const chatId = req.params.chatId;
        if (!chatId) {
            throw new CustomErrorClass('Chat not found', 400);
        }
        const chat = await Chat.findByPk(chatId, {
            include: [
                {
                    model: Message,
                    as: 'Messages',
                    attributes: ['id', 'content', 'createdAt'],
                    include: [
                        {
                            model: User,
                            as: 'Sender',
                            attributes: ['id', 'username']
                        }
                    ],
                    // order: [['createdAt', 'ASC']]
                },
                {
                    model: User,
                    as: 'Users',
                    attributes: ['id', 'username'],
                    where: {
                        id: { [Op.not]: userId }
                    }
                }
            ]
        });


        res.status(200).json({ message: "Success in getting all messages", chat });

    } catch (err) {
        console.log('error in getting all user chats');
        next(err);
    }
};

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.userId;
        const chatId: any = req.query.chatId;
        const receiverId: any = req.query.receiverId;
        const content: any = req.body.content;
        let chat: any;

        console.log(chatId, receiverId)
        if (!chatId) {
            if (!receiverId) {
                throw new CustomErrorClass('Chat not found', 400);
            }

            const user = await User.findByPk(userId);
            const friend = await User.findByPk(receiverId);


            if (!user || !friend) {
                throw new CustomErrorClass('User not found', 400);
            }

            await user.addFriend(friend);
            await friend.addFriend(user);

            chat = await Chat.create({});
            await chat.addUsers([user, friend]);
        }
        // Create new message
        const newMessage = await Message.create({
            content,
            senderId: userId,
        });

        // Add message to chat
        if (!chat) {
            chat = await Chat.findByPk(chatId);
        }
        if (!chat) {
            throw new CustomErrorClass('Chat not found', 400);
        }
        await chat?.addMessage(newMessage);

        // Socket.IO - Notify users about the new message
        const chatUsers = await chat.getUsers();

        chatUsers.forEach((user: any) => {
            if (userSocketMap[user.id]) {
                io.to(userSocketMap[user.id]).emit('new message', {
                    chatId: chat.id,
                    msg: content,
                    id: userSocketMap[userId],
                    
                });
            }
        });

        res.status(201).json({ message: "Message created successfully", newMessage });


    } catch (err) {
        console.log('error in send message');
        next(err);
    }
};


export { getUserChats, getMessages, sendMessage };
