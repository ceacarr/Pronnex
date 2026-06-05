# Pronnex

Pronnex is a project and task management application built with a React frontend and an Express/MongoDB backend.

It supports workspaces, projects, task boards, task details, comments, subtasks, members, invitations, archived tasks, profile settings, and dashboard statistics.

---
<img width="1919" height="998" alt="Screenshot 2026-06-05 161620" src="https://github.com/user-attachments/assets/88f0069b-97d6-4c0d-b20e-426fbac5d1d3" />
<img width="1919" height="971" alt="Screenshot 2026-06-05 161548" src="https://github.com/user-attachments/assets/429b7513-09cb-477f-b40c-91cfca25bf03" />

## Features

* User authentication with email verification
* JWT-based protected API routes
* Workspace creation, listing, switching, invitations, and deletion
* Project creation, detail pages, settings, update, and deletion
* Task board with To Do, In Progress, and Done columns
* Task creation, update, archive/unarchive, and deletion
* Task details with title, description, status, priority, assignees, subtasks, watchers, comments, and activity logs
* My Tasks page with list, board, calendar, and timeline views
* Achieved page for archived tasks
* Members page with role-based invitations
* Profile and settings pages
* Dashboard statistics and charts
* SendGrid email integration
* MongoDB persistence with Mongoose models

---

## Tech Stack

### Frontend

* React 19
* React Router 7
* TypeScript
* Vite
* Tailwind CSS
* Radix UI / shadcn-style components
* TanStack React Query
* Axios
* React Hook Form
* Zod
* date-fns
* React Day Picker
* Recharts
* Lucide React
* Sonner
* dnd-kit

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod
* zod-express-middleware
* SendGrid Mail
* Arcjet
* Helmet
* CORS
* Morgan
* express-rate-limit

---

## Project Structure

```text
Pronnex/
├── Backend/
│   ├── controllers/
│   ├── libs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── provider/
│   │   ├── routes/
│   │   └── types/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
└── README.md
```

---

## Environment Variables

Real `.env` files are ignored by Git.

Use the example files as templates.

### Backend

Create `Backend/.env` from `Backend/.env.example`

```env
MONGO_URI=
PORT=5000

JWT_SECRET=
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

SEND_GRID_API=
FROM_EMAIL=

ARCJET_ENV=development
ARCJET_KEY=
```

### Frontend

Create `Frontend/.env` from `Frontend/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Install Backend Dependencies

```bash
cd Backend
npm install
```

### Install Frontend Dependencies

```bash
cd Frontend
npm install
```

---

## Running Locally

### Start Backend

```bash
cd Backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Build

### Build Frontend

```bash
cd Frontend
npm run build
```

### Run Type Check

```bash
cd Frontend
npm run typecheck
```

### Start Backend in Production

```bash
cd Backend
npm start
```

---

## API Overview

All backend routes are mounted under:

```text
/api
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/reset-password-request
POST /api/auth/reset-password
```

### Workspaces

```http
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:workspaceId
GET    /api/workspaces/:workspaceId/projects
GET    /api/workspaces/:workspaceId/stats
DELETE /api/workspaces/:workspaceId
POST   /api/workspaces/:workspaceId/invite-member
POST   /api/workspaces/:workspaceId/accept-generate-invite
POST   /api/workspaces/accept-invite-token
```

### Projects

```http
POST   /api/projects/:workspaceId/create-project
GET    /api/projects/:projectId
GET    /api/projects/:projectId/tasks
PUT    /api/projects/:projectId
DELETE /api/projects/:projectId
```

### Tasks

```http
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
```

---

## Frontend Pages

```text
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
```

---

## Data Models

Main backend models:

* User
* Workspace
* WorkspaceInvite
* Project
* Task
* Comment
* ActivityLog
* Verification
* Notification

---

## Git & Secrets

Ignored files:

```gitignore
.env
.env.*
Backend/.env
Frontend/.env
```

Committed files:

```text
Backend/.env.example
Frontend/.env.example
```

If any real environment variables were ever exposed, rotate:

* JWT_SECRET
* SEND_GRID_API
* ARCJET_KEY
* MongoDB credentials

---

## Notes

* MongoDB is used through Mongoose.
* Authentication token is stored in localStorage.
* React Query handles API caching and refetching.
* Archived tasks are hidden from active project boards and shown in the Achieved page.
* Workspace invitations use TTL indexes through `expiresAt`.
* Activity logs currently do not expire automatically.

```
```
