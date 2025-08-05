dotenv.config()
import Url from "../models/url.js";
import dotenv from "dotenv";
import { nanoid } from 'nanoid'

export const shortUrl = async (req, res) => {
    // accepting the url
    const { origonalUrl } = req.body;
    try {
        // genrating the shortid 
        const shortUrl = nanoid(8);
        const url = await Url.create({
            origonalUrl,
            shortUrl
        })
        return res.status(200).json({ message: "URL Genrated ", url: url })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Server Error` });
    }
}

