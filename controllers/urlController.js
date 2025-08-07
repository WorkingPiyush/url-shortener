dotenv.config()
import Url from "../models/url.js";
import dotenv from "dotenv";
import { nanoid } from 'nanoid'
// shorting URL func..
export const shortUrl = async (req, res) => {
    try {
        // accepting the url
        const { origonalUrl } = req.body;
        const userId = req.user.id;
        const shortUrl = nanoid(8);
        // validating the url
        const urlValidation = new RegExp(/^(http|https):\/\/[^ "]+$/);
        if (!urlValidation.test(origonalUrl)) {
            return res.status(400).json({ message: "Invalid URL" })
        }
        // checking the DB for the existing URL
        const existingUrl = await Url.findOne({ origonalUrl });
        if (existingUrl) {
            return res.status(200).json({ message: "URL already exists", url: existingUrl });
        }
        const expirationDate = new Date();
        // adding a expiry time after 7 days from now
        expirationDate.setDate(expirationDate.getDate() + 7);
        // saving the url in DB
        const newurl = await Url.create({
            origonalUrl,
            shortUrl,
            expirationDate,
            User: userId
        })
        return res.status(200).json({ message: "URL Genrated ", url: newurl })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server", error })
    }
}
// redirecting the short url
export const redirectUrl = async (req, res) => {
    // getting the short url kind of id
    try {
        const { shortUrl } = req.params;
        // checking in the DB
        const url = await Url.findOne({ shortUrl });
        if (!url || (url.expirationDate && url.expirationDate < new Date())) {
            res.status(400).json("Url expired or not found")
            return
        }
        url.clicks++;
        // saving the clicks in the DB
        await url.save();
        res.redirect(url.origonalUrl)
    } catch (error) {
        console.error("Redirect error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
// getting all the created url by a specific user
export const getmyUrl = async (req, res) => {
    try {
        let userId = req.user.id
        const fetchUrls = await Url.find({ User: userId }).sort({ createdAt: -1 });
        if (fetchUrls.length == 0) {
            return res.status(202).json({ message: "No Genrated URLs Found !" });
        }
        res.status(200).json(fetchUrls);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error });
    }
}
