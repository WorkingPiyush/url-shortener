import express from "express";
const router = express.Router();
// extracted the register and login routes 
import { register, login, logout } from '../controllers/authController.js'


// attaching with the router endpint for accessing the api 
router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)


export default router;