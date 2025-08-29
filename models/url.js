import mongoose from "mongoose";
// url structured schema
const UrlSchema = mongoose.Schema({
    originalUrl: {
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
    expirationDate: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // this will delete the url after the expiration time passes.
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hashPassword: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model('Url', UrlSchema);