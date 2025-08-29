import mongoose from "mongoose";
// blackListed jwt tokens structured schema
const BlacklistSchema = mongoose.Schema({
    token: {
        type: String, required: true, unique: true,
    },
    expiry: {
        type: Date, required: true, index: { expireAfterSeconds: 0 },
    },
},
    { timestamps: true }
)

export default mongoose.model('blackList', BlacklistSchema)

