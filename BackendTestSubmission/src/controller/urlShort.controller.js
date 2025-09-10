import { ShortUrl } from "../model/shortUrl.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const autogenerateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortCode = '';
    for (let i = 0; i < 7; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortCode;
}

const addShortURL = asyncHandler(async(req, res) => {
    try {
        const { url, validity, shortCode } = req.body
        if (!url || !validity ){
            throw new ApiError(400, "All fields are required")
        }
        
        if (!shortCode){
            shortCode = autogenerateShortCode()
            const exists = await ShortUrl.exists({ shortCode });
            while (exists) {
                shortCode = autogenerateShortCode();
                exists = await ShortUrl.exists({ shortCode });
            }
        }
    
        const shortLink = ShortUrl.create({url, shortCode, validity, clicks: 0, createdAt: Date.now()})
        if (!shortLink){
            throw new ApiError(400, "Something went wrong")
        }
        
        return res.status(201).json(new ApiResponse(201, {shortLink, expiry: validity}, "Short URL created successfully"))
    } catch (error) {
        throw new ApiError(400, error.message)
    }
})

const getShortURLStats = asyncHandler(async(req, res) => {
    const { shortCode } = req.params
    if (!shortCode){
        throw new ApiError(400, "Short code is required")
    }
    const shortLink = await ShortUrl.findOne({shortCode}).lean()
    if (!shortLink){
        throw new ApiError(400, "Short code not found")
    }
    const expiry = shortLink.createdAt + shortLink.validity * 24 * 60 * 60 * 1000
    if (Date.now() > expiry){
        throw new ApiError(400, "Short code has expired")
    }

    const returnLink = {
        shortCode: shortLink.shortCode,
        url: shortLink.url,
        clicks: shortLink.clicks,
        expiry: expiry
    }

    return res.status(200).json(new ApiResponse(200, returnLink, "Short URL stats fetched successfully"))
})

const accessShortURL = asyncHandler(async(req, res) => {
    const {shortCode} = req.params;
    const shortLink = await ShortUrl.findOne({ shortCode });
    if (!shortLink) {
    throw new ApiError(400, "Short code not found");
    }

    const expiry = shortLink.createdAt + shortLink.validity * 24 * 60 * 60 * 1000;
    if (Date.now() > expiry) {
    throw new ApiError(400, "Short code has expired");
    }

    shortLink.clicks += 1;
    await shortLink.save();

    return res.redirect(shortLink.url);
})

export{
    addShortURL,
    getShortURLStats,
    accessShortURL
}