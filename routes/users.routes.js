const { Router } = require("express");
const usersControllers = require("../controllers/users.controllers");
const authMiddleware = require("../middlewares/auth.middilewares");

const router = Router();

router.get("/ads", authMiddleware, usersControllers.getAllAdUser);
router.get("/ads/search", authMiddleware, usersControllers.searchAdsUSer);
router.get("/ads/:adID", authMiddleware, usersControllers.getSingleAdUSer);

module.exports = router;
