const Sprint = require("../models/Sprint");
const Project = require("../models/Project");

const createSprint = async (req, res) => {
  try {
    const { title, description, projectId, startDate, endDate, goals } =
      req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }
    if (project.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Seul l'étudiant propriétaire peut créer des sprints",
      });
    }
    const sprintCount = await Sprint.countDocuments({ project: projectId });
    const sprintNumber = sprintCount + 1;
    const sprint = await Sprint.create({
      title,
      description,
      project: projectId,
      sprintNumber,
      startDate,
      endDate,
      goals,
    });
    await sprint.populate("project", "title");

    res.status(201).json({
      success: true,
      data: { sprint },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSprint,
};
