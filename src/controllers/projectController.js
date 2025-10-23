const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      encadrantEntreprise,
      encadrantUniversitaire,
      startDate,
      endDate,
      soutenanceDate,
    } = req.body;
    const encEntreprise = await User.findOne({
      _id: encadrantEntreprise,
      role: "encadrant_entreprise",
      isActive: true,
    });

    const encUniversitaire = await User.findOne({
      _id: encadrantUniversitaire,
      role: "encadrant_universitaire",
      isActive: true,
    });

    if (!encEntreprise) {
      return res.status(400).json({
        success: false,
        message: "Encadrant entreprise invalide",
      });
    }

    if (!encUniversitaire) {
      return res.status(400).json({
        success: false,
        message: "Encadrant universitaire invalide",
      });
    }
    const project = await Project.create({
      title,
      description,
      student: req.user._id,
      encadrantEntreprise,
      encadrantUniversitaire,
      startDate,
      endDate,
      soutenanceDate,
    });
    await project.populate([
      { path: "student", select: "firstName lastName email" },
      { path: "encadrantEntreprise", select: "firstName lastName email" },
      { path: "encadrantUniversitaire", select: "firstName lastName email" },
    ]);

    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
};
