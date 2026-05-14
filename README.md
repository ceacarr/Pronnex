Pronnex
Pronnex is a project and task management application built with a React frontend and an Express/MongoDB backend. It supports workspaces, projects, task boards, task details, comments, subtasks, members, invitations, archived tasks, profile settings, and dashboard statistics.

Features
User authentication with email verification
JWT-based protected API routes
Workspace creation, listing, switching, invitations, and deletion
Project creation, detail pages, settings, update, and deletion
Task board with To Do, In Progress, and Done columns
Task creation, update, archive/unarchive, and deletion
Task details with title, description, status, priority, assignees, subtasks, watchers, comments, and activity logs
My Tasks page with list, board, calendar, and timeline views
Achieved page for archived tasks
Members page with role-based invitations
Profile and settings pages
Dashboard statistics and charts
SendGrid email integration
MongoDB persistence with Mongoose models
Tech Stack
Frontend
React 19
React Router 7
TypeScript
Vite
Tailwind CSS
Radix UI / shadcn-style components
TanStack React Query
Axios
React Hook Form
Zod
date-fns
React Day Picker
Recharts
Lucide React
Sonner
dnd-kit
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Zod
zod-express-middleware
SendGrid Mail
Arcjet
Helmet
CORS
Morgan
express-rate-limit
Project Structure
Pronnex/
  Backend/
    controllers/
    libs/
    middleware/
    models/
    routes/
    index.js
    package.json
    .env.example

  Frontend/
    app/
      components/
      hooks/
      lib/
      provider/
      routes/
      types/
    package.json
    vite.config.ts
    .env.example

  README.md
Environment Variables
Real .env files are ignored by Git. Use the example files as templates.

Backend
Create Backend/.env from Backend/.env.example:

MONGO_URI=
PORT=5000
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
SEND_GRID_API=
FROM_EMAIL=
ARCJET_ENV=development
ARCJET_KEY=
Frontend
Create Frontend/.env from Frontend/.env.example:

VITE_API_URL=http://localhost:5000/api
Installation
Install backend dependencies:

cd Backend
npm install
Install frontend dependencies:

cd Frontend
npm install
Running Locally
Start the backend:

cd Backend
npm run dev
The backend runs on:

http://localhost:5000
Start the frontend:

cd Frontend
npm run dev
The frontend runs on:

http://localhost:5173
Build
Build the frontend:

cd Frontend
npm run build
Run frontend type checks:

cd Frontend
npm run typecheck
Start backend in production mode:

cd Backend
npm start
API Overview
Backend routes are mounted under /api.

Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/reset-password-request
POST /api/auth/reset-password
Workspaces
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:workspaceId
GET    /api/workspaces/:workspaceId/projects
GET    /api/workspaces/:workspaceId/stats
DELETE /api/workspaces/:workspaceId
POST   /api/workspaces/:workspaceId/invite-member
POST   /api/workspaces/:workspaceId/accept-generate-invite
POST   /api/workspaces/accept-invite-token
Projects
POST   /api/projects/:workspaceId/create-project
GET    /api/projects/:projectId
GET    /api/projects/:projectId/tasks
PUT    /api/projects/:projectId
DELETE /api/projects/:projectId
Tasks
POST   /api/task/:projectId/create-task
GET    /api/task/my-tasks
GET    /api/task/:taskId
PUT    /api/task/:taskId/title
PUT    /api/task/:taskId/description
PUT    /api/task/:taskId/status
PUT    /api/task/:taskId/priority
PUT    /api/task/:taskId/assignees
POST   /api/task/:taskId/add-subtask
PUT    /api/task/:taskId/update-subtask/:subTaskId
POST   /api/task/:taskId/add-comment
GET    /api/task/:taskId/comments
POST   /api/task/:taskId/watch
POST   /api/task/:taskId/achieved
DELETE /api/task/:taskId
GET    /api/task/:resourceId/activity
Frontend Pages
Main application routes:

/
/sign-in
/sign-up
/forgot-password
/reset-password
/verify-email
/dashboard
/workspaces
/workspace/:workspaceId
/workspace/:workspaceId/projects/:projectId
/workspace/:workspaceId/projects/:projectId/settings
/workspace/:workspaceId/projects/:projectId/tasks/:taskId
/my-tasks
/members
/achieved
/settings
/workspace-invite/:workspaceId
/user/profile
Data Models
Main backend models:

User
Workspace
WorkspaceInvite
Project
Task
Comment
ActivityLog
Verification
Notification
Git and Secrets
The repository ignores real environment files:

.env
.env.*
Backend/.env
Frontend/.env
Only example files should be committed:

Backend/.env.example
Frontend/.env.example
If a real .env file was ever pushed to a public repository, rotate these values:

JWT_SECRET
SEND_GRID_API
ARCJET_KEY
MongoDB connection credentials
Notes
The backend uses MongoDB through Mongoose.
The frontend stores the auth token in localStorage.
React Query is used for API cache and refetching.
Archived tasks are hidden from project boards and shown in the Achieved page.
Invite records have a TTL index through expiresAt.
Activity logs do not currently have automatic expiration.
