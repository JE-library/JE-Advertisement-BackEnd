const { Router } = require("express");
const vendorControllers = require("../controllers/vendors.controllers");
const authMiddleware = require("../middlewares/auth.middilewares");

const router = Router();

router.get("/ads", authMiddleware, vendorControllers.getAllAdVendor);
router.get("/ads/search", authMiddleware, vendorControllers.searchAdsVendor);
router.get("/ads/:adID", authMiddleware, vendorControllers.getSingleAdVendor);

module.exports = router;
