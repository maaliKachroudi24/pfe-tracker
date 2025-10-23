const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis: ${roles.join(" ou ")}`,
      });
    }
    next();
  };
};

const studentOnly = restrictTo("etudiant");
const encadrantsOnly = restrictTo(
  "encadrant_entreprise",
  "encadrant_universitaire"
);
const encadrantUniversitaireOnly = restrictTo("encadrant_universitaire");
const allRoles = restrictTo(
  "etudiant",
  "encadrant_entreprise",
  "encadrant_universitaire"
);
const checkProjectAccess = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    console.log("checkProjectAccess req.params", req.params);
    const projectId =
      req.params?.projectId || req.body?.projectId || req.params?.id;
    console.log("projectId", projectId);

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "ID du projet manquant",
      });
    }

    const project = await Project.findById(projectId);
    console.log("project", project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    const userId = req.user._id.toString();
    const hasAccess =
      project.student.toString() === userId ||
      project.encadrantEntreprise.toString() === userId ||
      project.encadrantUniversitaire.toString() === userId;
    console.log("id user userId");
    console.log(userId);
    console.log("id projet student");
    console.log(project.student);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé à ce projet",
      });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Erreur lors de la vérification des droits projet " + error.message,
    });
  }
};

const checkStudentOwnership = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const project = req.project;

    if (project.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Seul l'étudiant propriétaire peut effectuer cette action",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de propriété",
    });
  }
};

module.exports = {
  restrictTo,
  studentOnly,
  encadrantsOnly,
  encadrantUniversitaireOnly,
  allRoles,
  checkProjectAccess,
  checkStudentOwnership,
};
