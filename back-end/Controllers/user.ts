import { Request, Response, NextFunction, query } from "express";
import { User, Chat } from "../Models/Index";
import CustomErrorClass from '../types/customErrorClass'
import { Op } from 'sequelize';

require('dotenv').config();

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) {
            const err = new CustomErrorClass('Unauthorized access', 401);
            throw err;
        }

        const user = await User.findByPk(userId, {
            attributes: ['id', 'fName', 'lName', 'userName', 'imageUrl'],
        });
        if (!user) {
            const err = new CustomErrorClass('User not found', 404);
            throw err;
        }

        res.status(200).json({
            status: 'success',
            data: user,
        });


    } catch (err) {
        console.log('error in getting user data');
        next(err);
    }
};
const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        const { query } = req.params;

        const current_user = await User.findByPk(userId);
        const userFriends=await current_user?.getFriends(); 
        const userFriendsIds=userFriends?.map((friend)=>friend.id)

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { userName: { [Op.like]: `%${query}%` } },
                    { fName: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'fName', 'lName', 'userName', 'imageUrl'],
            limit: 10,
           
        });

        const users_data = users.map(user => {
            //if user is friend to current friend
            const isFriend = userFriendsIds?.includes(user.id);
            return {
                id: user.id,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                imageUrl: user.imageUrl,
                isFriend: isFriend
                }
        })
        //fliter current user from users data
        const filtered_users_data = users_data.filter(user => user.id !== current_user?.id);
        

        res.status(200).json({
            status: 'success',
            data:  filtered_users_data ,
        });
    } catch (err) {
        console.log('error in getting user data');
        next(err);
    }
};
const getAllFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) {
            const err = new CustomErrorClass('Unauthorized access', 401);
            throw err;
        }

        const user = await User.findByPk(userId);
        if (!user) {
            const err = new CustomErrorClass('User not found', 404);
            throw err;
        }

        const friends = await user.getFriends();
        const friends_data = friends.map(friend => {
            return {
                id: friend.id,
                fName: friend.fName,
                lName: friend.lName,
                userName: friend.userName,
                imageUrl: friend.imageUrl

            }
        })


        res.status(200).json({ message: "Success in getting all friends", friends_data });


    } catch (err) {
        console.error('Error get user friends:', err);
        next(err);
    }
};


const addFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const friendId = req.params.friendId;

        if (!userId || !friendId) {
            const err = new CustomErrorClass('Unauthorized access', 401);
            throw err;
        }

        const user = await User.findByPk(userId);
        const friend = await User.findByPk(friendId);

        if (!user) {
            const err = new CustomErrorClass('User not found', 404);
            throw err;
        }
        if (!friend) {
            const err = new CustomErrorClass('Friend not found', 404);
            throw err;
        }
        if (user.id === friend.id) {
            const err = new CustomErrorClass('You can not add yourself as a friend', 400);
            throw err;
        }
        await user.addFriend(friend);
        await friend.addFriend(user);

        //add chat
        const chat = await Chat.create({});
        await chat.addUsers([user, friend]);
        res.status(200).json({ message: "Success in adding friend" });

    } catch (err) {
        console.error('Error add friend:', err);
        next(err);
    }
};

export { getAllFriend, addFriend, getUser, searchUser };
