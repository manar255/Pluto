import express from "express"
// import { query , body }from 'express-validator'
const router = express.Router();


import {getUserChats,sendMessage,getMessages}from'../Controllers/chat'
import isAuth from "../Middlewares/isAuth";
import uploadFile from "../Middlewares/uploadFile";

router.get('/getUserChats',isAuth,getUserChats);
router.get('/getMessages/:chatId',isAuth,getMessages);
router.post('/sendMessage/:chatId',isAuth,sendMessage);

export default router;