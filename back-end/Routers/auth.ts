import express from "express"
// import { query , body }from 'express-validator'
const router = express.Router();


import {signUp,signIn}from'../Controllers/auth'
import uploadFile from "../Middlewares/uploadFile";

router.post('/signUp',uploadFile.single('image'),signUp)

router.post('/signIn',signIn)
// router.post('/login',(req,res)=>{
//     console.log(req.body);
// })

export default router;