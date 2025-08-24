import dotenv from "dotenv";
import User from "../models/users.js"
import blackList from "../models/de-activatedSession.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

dotenv.config()

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("User Data", username, email, password)
    // checking if the mail is already exist or not..
    let userCheck = await User.findOne({ email: req.body.email })
    if (userCheck) {
        return res.status(400).send('User already exisits. Please sign in')
    } else {
        try {
            // hashing the password
            const hashPassword = await bcrypt.hash(password, 10);
            // saving the user credentials in DB
            const userCreate = await User.create({
                username,
                email,
                password: hashPassword
            })
            // sending the response
            res.status(201).json({ success: true, message: "User Created ", UserId: userCreate._id })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: `User already exist or server has some personal problem with you.` });
        }
    }
}

export const login = async (req, res) => {
    // fetching the details given by the user
    const { username, password } = req.body;
    // finding the username in the database
    try {
        const userFound = await User.findOne({ username })
        if (!userFound) return res.status(401).json({ message: `Invalid Username or password` });
        const solvedPassword = await bcrypt.compare(password, userFound.password)
        if (!solvedPassword) return res.status(401).json({ message: `Invalid Username or password` });
        // added a new type of payload
        const payload = {
            user: {
                id: userFound._id
            }
        };
        // creating a jwt token 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json(
            {
                success: true,
                message: "Access Granted",
                token
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: `Server Error`, error });
    }
}
// to be checked this route some problem is here regarding DB
export const logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token is missing !!" });
    try {
        const token = authHeader.split(' ')[1]
        // console.log(token)
        const decoded = jwt.decode(token);
        console.log(decoded)
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: "Invalid token" });
        }
        // settting an extra layer of expiry time after adding expiry in the jwt
        const jwtExpiry = new Date(decoded.exp * 1000)
        // sending data to the database and saving also
        const blacklisted = await blackList.create({
            token,
            expiry: jwtExpiry

        })
        // console.log(blacklisted)
        // sending the response to the client side
        res.status(200).json({ success: true, message: 'You are logged out!' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}