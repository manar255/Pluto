"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../Controllers/auth");
const uploadFile_1 = __importDefault(require("../Middlewares/uploadFile"));
router.post('/signUp', uploadFile_1.default.single('image'), auth_1.signUp);
// router.post('/login',(req,res)=>{
//     console.log(req.body);
// })
exports.default = router;
