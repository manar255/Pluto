import { Request, Response, NextFunction } from "express";
import { Chat, Message, User, db } from "../Models/Index";
import CustomErrorClass from '../types/customErrorClass'
import { Op } from 'sequelize';

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
                    where:{
                        id: {[Op.not]: userId}
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
       const userId:any = req.userId;
       const chatId = req.params.chatId;
       const content:any = req.body.content;
        if (!chatId) {
            throw new CustomErrorClass('Chat not found', 400);
            }
           // Create new message
        const newMessage = await Message.create({
            content,
            senderId: userId,
        });
        //add sender
        
        
        
        // Add message to chat
       const chat = await Chat.findByPk(chatId);
       await chat?.addMessage(newMessage);

            
        res.status(201).json({ message: "Message created successfully", newMessage });


    } catch (err) {
        console.log('error in getting all user chats');
        next(err);
    }
};


export { getUserChats , getMessages,sendMessage};
