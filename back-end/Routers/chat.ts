import express from "express"
// import { query , body }from 'express-validator'
const router = express.Router();


import {getUserChats,sendMessage,getMessages}from'../Controllers/chat'
import isAuth from "../Middlewares/isAuth";
import uploadFile from "../Middlewares/uploadFile";

router.get('/getUserChats',isAuth,getUserChats);
router.post('/sendMessage',isAuth,sendMessage);
router.get('/getMessages/:chatId',isAuth,getMessages);

export default router;