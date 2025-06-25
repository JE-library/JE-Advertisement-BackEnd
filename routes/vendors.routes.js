const { Router } = require("express");
const vendorControllers = require("../controllers/vendors.controllers");
const authMiddleware = require("../middlewares/auth.middilewares");
const upload = require("../utils/multer.utils");

const router = Router();

router.get(
  "/ads",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  vendorControllers.getAllAdVendor
);
router.get(
  "/ads/search",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  vendorControllers.searchAdsVendor
);
router.get(
  "/ads/:adID",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  vendorControllers.getSingleAdVendor
);
router.post(
  "/ads/",
  authMiddleware,
  upload.single("file"),
  // #swagger.security = [{bearerAuth:[]}],
  
  vendorControllers.addAdVendor
);
router.put(
  "/ads/:adID",
  authMiddleware,
  upload.single("file"),
  // #swagger.security = [{bearerAuth:[]}],
  vendorControllers.updateAdVendor
);
router.delete(
  "/ads/:adID",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  vendorControllers.deleteAdVendor
);

module.exports = router;
