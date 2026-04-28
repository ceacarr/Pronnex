import mongoose, { Schema } from "mongoose";

const workspaceInviteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

workspaceInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
workspaceInviteSchema.index({ user: 1, workspaceId: 1 });

const WorkspaceInvite = mongoose.model(
  "WorkspaceInvite",
  workspaceInviteSchema
);

export default WorkspaceInvite;
