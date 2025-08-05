import jwt from "jsonwebtoken";
// making this middleware for the authenticating the user
export const loginCheck = async (req, res, next) => {
    // checking the token which was provided during the login 
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: `Token is missing or wrong!!` })
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.User = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Invald Token!!`, error: error.message })
    }
}

