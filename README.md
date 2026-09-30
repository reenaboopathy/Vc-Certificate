# VC Certificate Management System — MERN

## What is included
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose persistence
- JWT authentication
- Login is always the first screen
- Dashboard and all application routes require a valid server-side login session
- No sample customer, scale, certificate, renewal, follow-up, payment or invoice records are seeded
- Sidebar collapse/expand layout is synchronized with the main content

## Login
The backend creates the initial administrator account automatically on first startup if that email does not already exist in MongoDB.

Default local credentials in `backend/.env`:

```text
Email: admin@vcmanager.local
Password: Admin@12345
```

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before using this outside local development.

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

MongoDB is required. Set `MONGODB_URI` in `backend/.env`.

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173/Vc-Certificate/
```

Expected flow:

```text
Open application
      ↓
    Login
      ↓
Valid email + password
      ↓
   Dashboard
      ↓
All protected modules
```

Direct access to protected routes without a valid JWT redirects to `/login`.
