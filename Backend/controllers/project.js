import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Comment from "../models/comment.js";
import ActivityLog from "../models/activity.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members.user");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    project.title = title;
    project.description = description;
    project.status = status;
    project.startDate = startDate;
    project.dueDate = dueDate;
    project.tags = tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];

    await project.save();

    const updatedProject = await Project.findById(projectId).populate("members.user");

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const canDelete =
      project.createdBy.toString() === req.user._id.toString() ||
      project.members.some(
        (member) =>
          member.user.toString() === req.user._id.toString() &&
          member.role === "manager"
      );

    if (!canDelete) {
      return res.status(403).json({
        message: "Only project managers can delete this project",
      });
    }

    const tasks = await Task.find({ project: projectId }).select("_id");
    const taskIds = tasks.map((task) => task._id);
    const comments = await Comment.find({ task: { $in: taskIds } }).select("_id");
    const commentIds = comments.map((comment) => comment._id);

    await Promise.all([
      Comment.deleteMany({ task: { $in: taskIds } }),
      ActivityLog.deleteMany({
        $or: [
          { resourceId: projectId },
          { resourceId: { $in: taskIds } },
          { resourceId: { $in: commentIds } },
        ],
      }),
      Task.deleteMany({ project: projectId }),
      Workspace.findByIdAndUpdate(project.workspace, {
        $pull: { projects: project._id },
      }),
      Project.findByIdAndDelete(projectId),
    ]);

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createProject,
  getProjectDetails,
  getProjectTasks,
  updateProject,
  deleteProject,
};
