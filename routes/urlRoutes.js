import express from "express";
const app = express()
const router = express.Router();
import { shortUrl, redirectUrl, getmyUrl } from '../controllers/urlController.js';
import { loginCheck } from "../middleware/loginCheck.js";

// attaching with the router endpint for accessing the api with a middleware which check the jwt token and authenticate the user
router.post('/short', loginCheck, shortUrl)
router.get('/getmy-Url', loginCheck, getmyUrl)
router.get('/:shortUrl', loginCheck, redirectUrl)

export default router;