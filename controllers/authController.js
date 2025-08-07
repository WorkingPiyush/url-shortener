dotenv.config()
import User from "../models/users.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    // checking if the mail is already exist or not..
    let userCheck = await user.findOne({ email: req.body.email })
    if (userCheck) {
        return res.status(400).send('User already exisits. Please sign in')
    } else {
        try {
            // hashing the password
            const hashPassword = await bcrypt.hash(password, 10);
            // saving the user credentials in DB
            const userCreate = await user.create({
                username,
                email,
                password: hashPassword
            })
            // sending the response
            res.status(200).json({ message: "User Created ", UserId: userCreate._id })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: `User already exist or server has some personla problem with you.` });
        }
    }
}

export const login = async (req, res) => {
    // fetching the details given by the user
    const { username, password } = req.body;
    // finding the username in the database
    const Oneuser = await User.findOne({ username })
    const solvedPassword = await bcrypt.compare(password, Oneuser.password)
    if (!Oneuser || !solvedPassword) return res.status(401).json({ message: `Invalid Username or password` });
    // added a new type of payload
    const payload = {
        user: {
            id: Oneuser._id
        }
    };
    // creating a jwt token 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json(
        {
            message: "Access Granted",
            token
        }
    )
}