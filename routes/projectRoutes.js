const express = require("express");
const router = express.Router();
const { createProject, getProjects,assignUsersToProject } = require("../controllers/projectController");
const { authMiddleware } = require("../controllers/authController");

router.post("/create", authMiddleware, createProject);

router.put("/:id/assign-users", authMiddleware, assignUsersToProject);

router.get("/", authMiddleware, getProjects);

module.exports = router;
