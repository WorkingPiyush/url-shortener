dotenv.config()
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { connectDB } from "./connectDB.js";
// added for accessing FE files
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 7001;
const app = express();

// rate limiting MW setup
const limitter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: "Bro you have reached your limits! Please try again in sometime."
})

// middleware used
app.use(express.json())
app.use(cookieParser())


// connected DB...
connectDB(process.env.MONGO_DB_URI)

// Home Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage.html'))
})

// authentication route
import authRoutes from './routes/authRoutes.js';
app.use('/api/', authRoutes)



app.use('/api', limitter) //rate-limiting middleware
// url working entry-point
import urlRoutes from './routes/urlRoutes.js'
app.use('/api/', urlRoutes)



// listening  the server 
app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})