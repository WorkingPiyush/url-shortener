import express from "express";
const router = express.Router();
// extracted the register and login routes 
import { register, login } from '../controllers/authController.js'


// attaching with the router endpint for accessing the api 
router.post("/register", register)
router.post("/login", login)


export default router;