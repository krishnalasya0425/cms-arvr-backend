const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Only admin can assign users" });

    const { id } = req.params;
    const { userId } = req.body; 

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const project = await Project.findByIdAndUpdate(
      id,
      { assignedTo: userId },
      { new: true }
    ).populate("assignedTo", "username email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Assign user error:", err);
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
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

