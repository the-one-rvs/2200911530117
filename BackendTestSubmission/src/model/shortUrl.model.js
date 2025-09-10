import mongoose, {Schema} from "mongoose";

const shortUrlSchema = new Schema (   
    {
        shortCode: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        validity: {
            type: Number,
            required: true,
            lowercase: true,
            trim: true,
            default: 30 
        },
        url: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        clicks: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, {timestamps: true}
)


export const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema)