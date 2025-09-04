const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, modules } = req.body;
    const project = await Project.create({
      name,
      createdBy: req.userId,
      modules: modules || [],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects of logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
