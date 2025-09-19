const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  assignUsersToProject,
  unassignUserFromProject,
  deleteProject,
  getProjectDetails,
} = require("../controllers/projectController");

const { authMiddleware } = require("../controllers/authController");

router.post("/create", authMiddleware, createProject);
router.put("/:id/assign-user", authMiddleware, assignUsersToProject);
router.put("/:id/unassign-user", authMiddleware, unassignUserFromProject); 
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectDetails);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
