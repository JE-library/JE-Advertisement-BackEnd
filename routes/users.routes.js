const { Router } = require("express");
const usersControllers = require("../controllers/users.controllers");
const authMiddleware = require("../middlewares/auth.middilewares");

const router = Router();

router.get(
  "/ads",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  usersControllers.getAllAdUser
);
router.get(
  "/ads/search",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  usersControllers.searchAdsUSer
);
router.get(
  "/ads/:adID",
  authMiddleware,
  // #swagger.security = [{bearerAuth:[]}],
  usersControllers.getSingleAdUSer
);

module.exports = router;
