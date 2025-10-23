// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encadrantEntreprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encadrantUniversitaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    soutenanceDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
