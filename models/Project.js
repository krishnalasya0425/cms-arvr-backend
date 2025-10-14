const mongoose = require("mongoose");

const subModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildPath: { type: String },
});

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildPath: { type: String },
  subModules: [subModuleSchema],
});

const subModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filePath: { type: String }, // .fbx, .glb, .obj
  subModels: [this], // recursive
});

// Model schema (new)
const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filePath: { type: String }, // .fbx, .glb, .obj
  subModels: [subModelSchema],
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    modules: [moduleSchema],
    models: [modelSchema], // <-- added
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
