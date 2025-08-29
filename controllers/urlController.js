import Url from "../models/url.js";
import dotenv from "dotenv";
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
dotenv.config()
// shorting URL func..
export const shortUrl = async (req, res) => {
    try {
        // accepting the url if the password
        const { origonalUrl } = req.body;
        if (!origonalUrl) {
            return res.status(400).json({ success: false, message: "Please provide the URL" });
        }
        // getting user ref
        const userID = req.user.id
        const shortUrl = nanoid(8);
        // validating the url
        const urlValidation = new URL(origonalUrl)
        // url Validation
        if (!urlValidation) {
            return res.status(400).json({ message: "Invalid URL" })
        }
        // checking the DB for the existing URL
        const existingUrl = await Url.findOne({ origonalUrl, User: userID });
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
            User: userID
        })
        // giving a a qr code response of short url
        const qrCodeImg = await QRCode.toDataURL(newurl.origonalUrl)
        return res.status(201).json({ success: true, url: newurl, qrCodeImg })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error", error })
    }
}
// redirecting the short url
export const redirectUrl = async (req, res) => {
    // getting the short url kind of id and if the password provided.
    try {
        const shortUrl = req.params.shortUrl;
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
        url.clicks++;
        // saving the clicks in the DB
        await url.save();
        return res.redirect(url.origonalUrl)

    } catch (error) {
        console.error("Redirect error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
// getting all the created url by the user
export const getmyUrl = async (req, res) => {
    try {
        let userId = req.user.id // getting user's refrence
        const fetchUrls = await Url.find({ User: userId }).sort({ createdAt: -1 }); // finding the all urls which this requested user has created and in a sort order
        if (fetchUrls.length === 0) {
        }
        // responding all the urls 
        res.status(200).json(fetchUrls);
    } catch (error) {
        // if there is any error comes this blk will help us to check the code
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
            return res.status(200).json({ success: true, url })
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
        res.json({ success: true, message: 'Your Selected URL is deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' });
    }
}
export const extendValidity = async (req, res) => {
    const { shortUrl } = req.params;
    if (!shortUrl) {
        return res.status(404).json({ success: false, message: 'Please use valid URL' })
    }
    try {
        let newexpirationDate = new Date()
        newexpirationDate.setDate(newexpirationDate.getDate() + 7)
        console.log(newexpirationDate)
        const update = {
            expirationDate: newexpirationDate,
        }
        await Url.findOneAndUpdate({ shortUrl }, update, { new: true })
        res.status(200).json({ success: true, message: 'Expiration Date Extended for 7 Days' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error we are woking on it!!'
        })
    }
}