const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    buildPath: { type: String }, // store file/folder path, not actual file
    subModules: [
      {
        name: { type: String, required: true },
        buildPath: { type: String },
        subModules: [
          {
            name: { type: String, required: true },
            buildPath: { type: String },
          },
        ],
      },
    ],
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modules: [ModuleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
