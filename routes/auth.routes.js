const { Router } = require("express");
const authControler = require("../controllers/auth.controllers");

const router = Router();

router.post("/sign-up", authControler.signUp);
router.post("/sign-in", authControler.signIn);

module.exports = router;
