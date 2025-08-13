import Url from "../models/url.js";
import dotenv from "dotenv";
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode'
dotenv.config()
// shorting URL func..
export const shortUrl = async (req, res) => {
    try {
        // accepting the url if the password
        const { origonalUrl, password } = req.body;
        const userId = req.user.id;
        let hashPassword = null;
        // if password is present
        if (password) {
            hashPassword = await bcrypt.hash(password, 10);
        }
        const shortUrl = nanoid(8);
        // validating the url
        const urlValidation = new URL(origonalUrl)
        if (!urlValidation) {
            return res.status(400).json({ message: "Invalid URL" })
        }
        // checking the DB for the existing URL
        const existingUrl = await Url.findOne({ origonalUrl, User: userId });
        if (existingUrl) {
            return res.status(409).json({ message: "URL already exists", url: existingUrl });
        }
        const expirationDate = new Date();
        // adding a expiry time after 7 days from now
        expirationDate.setDate(expirationDate.getDate() + 7);
        // saving the url in DB
        const newurl = await Url.create({
            origonalUrl,
            shortUrl,
            expirationDate,
            hashPassword,
            User: userId
        })
        return res.status(201).json({ message: "URL Genrated ", url: `${process.env.BASE}/${shortUrl}` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server", error })
    }
}
// redirecting the short url
export const redirectUrl = async (req, res) => {
    // getting the short url kind of id and if the password provided.
    try {
        const { shortUrl } = req.params;
        // const { password } = req.body;
        // checking in the DB
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            return res.status(404).json("Url not found")
        }
        if (url.expirationDate < new Date()) {
            console.log("Url expired")
            return res.status(403).json({ error: "Url expired" });
        }
        // if the password present in the db
        if (url.hashPassword) {
            // then please provide the password in the body
            if (!password) {
                return res.status(401).json({ message: "Password required" });
            }
            // compairing the giving password and the db stored password
            const isMatch = await bcrypt.compare(password, url.hashPassword)
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Password" });
            }
        }
        url.clicks++;
        // saving the clicks in the DB
        await url.save();
        const realUrl = url.origonalUrl
        // const qrCodeImg = await QRCode.toDataURL(realUrl) // made this qr code will use this through frontend | till then its will be a comment
        res.redirect(realUrl)
        // return res.status(200).json({
        //     message: "Url Genrated",
        //     Url: realUrl,
        //     qrCodeImg
        // })

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
// getting the details of short url
export const getUrlAnalytics = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl })
        if (url) {
            return res.status(200).json(url)
        }
        else return res.status(404).json({ message: "URL not found" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
// delete the URL
export const deleteUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        await Url.findOneAndDelete({ shortUrl });
        res.json('Your Selected URL is deleted')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' });
    }
}