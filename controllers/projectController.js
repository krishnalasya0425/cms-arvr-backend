const Project = require("../models/Project");
const jwt = require("jsonwebtoken");
const User=require("../models/User")

const checkAdmin = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.role === "admin" ? decoded : null;
};


exports.createProject = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId, role } = decoded;

    if (role !== "admin") {
      return res.status(403).json({ message: "Only admin can create projects" });
    }

    const { name, modules } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });
const projectData = {
  name,
  createdBy: userId,
  modules: modules || [],
};

if (req.body.assignedTo) projectData.assignedTo = req.body.assignedTo; 
const project = await Project.create(projectData);

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

exports.assignUsersToProject = async (req, res) => {
  try {
    const decoded = checkAdmin(req);
    if (!decoded) return res.status(403).json({ message: "Only admin can assign users" });

    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const project = await Project.findByIdAndUpdate(
      id,
      { assignedTo: userId },
      { new: true }
    ).populate("assignedTo", "username email");

    if (!project) return res.status(404).json({ message: "Project not found" });


    await User.findByIdAndUpdate(userId, { assignedProject: project._id });

    res.json(project);
  } catch (err) {
    console.error("Assign user error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.unassignUserFromProject = async (req, res) => {
  try {
    const decoded = checkAdmin(req);
    if (!decoded) return res.status(403).json({ message: "Only admin can unassign users" });

    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = project.assignedTo;


    project.assignedTo = null;
    await project.save();

    if (userId) {
      await User.findByIdAndUpdate(userId, { assignedProject: null });
    }

    res.json({ message: "User unassigned successfully", project });
  } catch (err) {
    console.error("Unassign user error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateProject = async (req, res) => {
  try {
    const decoded = checkAdmin(req);
    if (!decoded) return res.status(403).json({ message: "Only admin can update projects" });

    const { id } = req.params;
    const { name, modules } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, modules },
      { new: true }
    ).populate("assignedTo", "username email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getProjects = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId, role } = decoded;

    let projects;
    if (role === "admin") {
      projects = await Project.find().populate("assignedTo", "username email");
    } else {
      projects = await Project.find({ assignedTo: userId });
    }

    res.json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("createdBy", "username email role")
      .populate("assignedTo", "username email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Get project details error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const decoded = checkAdmin(req);
    if (!decoded) return res.status(403).json({ message: "Only admin can delete projects" });

    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: err.message });
  }
};