import express from "express";
const app = express()
import cors from "cors";
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb" }))

import urlShortRoutes from "./routes/urlShort.routes.js"
app.use(urlShortRoutes)

export { app }