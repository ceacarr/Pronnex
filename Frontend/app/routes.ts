import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Ana sayfa
  index("routes/root/home.tsx"),

  // Auth routes (auth layout ile)
  layout("routes/auth/auth-layout.tsx", [
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
  ]),

  // Dashboard routes (dashboard layout ile)
  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
    route("workspaces", "routes/dashboard/workspace/index.tsx"),
    route("workspace/:workspaceId", "routes/dashboard/workspace/workspace-details.tsx"),
    route(
      "workspace/:workspaceId/projects/:projectId",
      "routes/dashboard/project/project-details.tsx"
    ),
    route(
      "workspace/:workspaceId/projects/:projectId/tasks/:taskId",
      "routes/dashboard/task/task-details.tsx"
    ),
    route(
      "my-tasks", "routes/dashboard/my-tasks.tsx"
    )
  ]),
] satisfies RouteConfig;
