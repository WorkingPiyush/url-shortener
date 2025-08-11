dotenv.config()
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./connectDB.js";
const PORT = 7001;
const app = express();
// middleware used
app.use(express.json())
app.use(cookieParser())

// connected DB...
connectDB(process.env.MONGO_DB_URI)

// Home Page Route
app.get('/', (req, res) => {
    res.send("Home Page")
})

// authentication route
import authRoutes from './routes/authRoutes.js';
app.use('/api/', authRoutes)
// url working entry-point
import urlRoutes from './routes/urlRoutes.js'
app.use('/api/', urlRoutes)



// listening  the server 
app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})