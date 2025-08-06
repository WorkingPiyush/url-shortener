import mongoose from "mongoose";
// url structured schema
const UrlSchema = mongoose.Schema({
    origonalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: String,
        default: Date.now,
    },
    expirationDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

export default mongoose.model('Url', UrlSchema);