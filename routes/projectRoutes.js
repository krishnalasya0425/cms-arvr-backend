const express = require("express");
const router = express.Router();
const { createProject, getProjects } = require("../controllers/projectController");
const { authMiddleware } = require("../controllers/authController");

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);

module.exports = router;
