const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getUser,authMiddleware } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authMiddleware,getUser)

module.exports = router;
