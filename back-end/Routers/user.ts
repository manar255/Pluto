import express from "express"
// import { query , body }from 'express-validator'
const router = express.Router();


import {getAllFriend,addFriend}from'../Controllers/user'
import isAuth from "../Middlewares/isAuth";
import uploadFile from "../Middlewares/uploadFile";

router.get('/getAllFriends',isAuth,getAllFriend);
router.put('/addFriend/:friendId',isAuth,addFriend);

export default router;