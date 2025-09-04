const mongoose = require("mongoose");

const subModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildPath: { type: String }, // path to Unity build file
});

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildPath: { type: String },
  subModules: [subModuleSchema],
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [moduleSchema],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
