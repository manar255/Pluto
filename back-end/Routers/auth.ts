import express from "express"

const router = express.Router();

import {signUp}from'../Controllers/auth'
import uploadFile from "../Middlewares/uploadFile";

router.post('/signUp',uploadFile.single('image'),signUp)
// router.post('/login',(req,res)=>{
//     console.log(req.body);
// })

export default router;