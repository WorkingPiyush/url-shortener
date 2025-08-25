dotenv.config()
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "./connectDB.js";


// added for accessing public fronted files
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PORT & CORS
const PORT = 7001;
import cors from "cors";
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
export const app = express();

// rate limiting MW setup
const limitter = rateLimit({
    max: 15,
    windowMs: 60 * 60 * 1000,
    message: "Bro you have reached your limits! Please try again in sometime."
})

// middleware used
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// connected DB...
connectDB(process.env.MONGO_DB_URI)

// Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage01.html'))
})


// authentication route
import authRoutes from './routes/authRoutes.js';
app.use('/api/', authRoutes)
// adding frontfaces to the routes
app.use("/register", express.static(path.join(__dirname, 'public', 'register.html')))
app.use("/login", express.static(path.join(__dirname, 'public', 'login.html')))
app.use("/logout", express.static(path.join(__dirname, 'public', 'logout.html')))

//rate-limiting middleware
// app.use('/api', limitter)

// url working entry-point
import urlRoutes from './routes/urlRoutes.js'
app.use('/api/', urlRoutes)
// adding frontfaces to the routes
app.use("/home", express.static(path.join(__dirname, 'public', 'homePage02.html')))
app.use("/myURLs", express.static(path.join(__dirname, 'public', 'getURLLists.html')))



// listening  the server 
app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})