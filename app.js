dotenv.config()
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "./connectDB.js";
import bodyParser from 'body-parser';
// added for accessing public fronted files
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 7001;
export const app = express();

// rate limiting MW setup
const limitter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: "Bro you have reached your limits! Please try again in sometime."
})

// middleware used
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// connected DB...
connectDB(process.env.MONGO_DB_URI)

// Home Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage01.html'))
})
// authentication route
import authRoutes from './routes/authRoutes.js';
app.use('/api/', authRoutes)

// adding frontfaces to the routes
app.use("/api/register", express.static(path.join(__dirname, 'public', 'register.html')))
app.use("/api/login", express.static(path.join(__dirname, 'public', 'login.html')))

app.use('/api', limitter) //rate-limiting middleware
// url working entry-point
import urlRoutes from './routes/urlRoutes.js'
app.use('/api/', urlRoutes)
// adding frontfaces to the routes
app.use("/short", express.static(path.join(__dirname, 'public', 'homePage02.html')))



// listening  the server 
app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})