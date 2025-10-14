const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getUser,authMiddleware, getAllUsers,adminExists } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authMiddleware,getUser)
router.get("/all-users",authMiddleware,getAllUsers)
router.put("/:id",authMiddleware,)
router.get("/admin-exists", adminExists);

module.exports = router;
