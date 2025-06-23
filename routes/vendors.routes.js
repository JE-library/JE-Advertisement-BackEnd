const { Router } = require("express");
const vendorControllers = require("../controllers/vendors.controllers");
const authMiddleware = require("../middlewares/auth.middilewares");
const upload = require("../utils/multer.utils");

const router = Router();

router.get("/ads", authMiddleware, vendorControllers.getAllAdVendor);
router.get("/ads/search", authMiddleware, vendorControllers.searchAdsVendor);
router.get("/ads/:adID", authMiddleware, vendorControllers.getSingleAdVendor);
router.put(
  "/ads/:adID",
  authMiddleware,
  upload.single("file"),
  vendorControllers.updateAdVendor
);
router.delete("/ads/:adID", authMiddleware, vendorControllers.deleteAdVendor);

module.exports = router;
