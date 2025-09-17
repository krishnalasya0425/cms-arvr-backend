const User = require("../models/User");
const Project = require("../models/Project"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;


    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  } catch (err) {
    console.error("registerUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("loginUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email role");
    res.json(user);
  } catch (err) {
    console.error("getUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select("username email role");

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (currentUser.role === "admin") {
      const users = await User.find()
        .select("username email role assignedProject")
        .populate({ path: "assignedProject", select: "name" });
      return res.json(users);
    }

 
    res.json([
      await User.findById(req.userId)
        .select("username email role assignedProject")
        .populate({ path: "assignedProject", select: "name" }),
    ]);
  } catch (err) {
    console.error("getAllUsers error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
