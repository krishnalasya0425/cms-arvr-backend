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
// Assign user to project (Admin only)
router.put("/:id/assign", assignUsersToProject);

// Unassign user from project (Admin only)
router.put("/:id/unassign", unassignUserFromProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectDetails);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
