const { Router } = require("express");
const authControler = require("../controllers/auth.controllers");

const router = Router();

//SIGN-UP ROUTE
router.post("/sign-up", authControler.signUp);
router.post("/sign-in", authControler.signIn);

module.exports = router;
