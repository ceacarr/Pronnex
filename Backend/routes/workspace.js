import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
} from "../controllers/workspace.js";
import { createProject } from "../controllers/project.js";
import { workspaceSchema, projectSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.post(
  "/:workspaceId/projects",
  authMiddleware,
  validateRequest({ body: projectSchema }),
  createProject
);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);


export default router;
