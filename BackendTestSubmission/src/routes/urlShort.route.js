import { Router } from "express";

const router = Router()

import {getShortURLStats, accessShortURL, addShortURL } from "../controller/urlShort.controller.js"

router.route("/shorturl").post(addShortURL)
// router.route("/shorturl").post(addShortURL)
router.route("/shorturls/:shortCode").get(getShortURLStats)
router.route("/shorturl/:shortCode/redirect").get(accessShortURL)

export default router