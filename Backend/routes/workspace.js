import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  deleteWorkspace,
  acceptGenerateInvite,
  acceptInviteByToken,
  inviteUserToWorkspace,
} from "../controllers/workspace.js";
import { createProject } from "../controllers/project.js";
import {
  workspaceSchema,
  projectSchema,
  inviteMemberSchema,
  tokenSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);
router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);
router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
router.delete(
  "/:workspaceId",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  deleteWorkspace
);



export default router;
