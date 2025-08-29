import jwt from "jsonwebtoken";
import blackList from "../models/de-activatedSession.js"

// making this middleware for authenticating the user
export const loginCheck = async (req, res, next) => {
    // checking the token which was provided during the login 
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: `Token is missing or wrong!!` })
        }
        const token = authHeader.split(' ')[1]
        const blacklisted = await blackList.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Session Expired, please login again" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET,);
        if (decoded) {
            req.user = decoded.user;
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: `Server Error !!`, error: error.message })
    }
}

