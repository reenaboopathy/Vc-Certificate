# VC Certificate Management — Pro Workflow MERN App

A responsive React + Vite frontend with Node/Express + MongoDB backend for customer, instrument, VCID, certificate, renewal, follow-up, invoice and payment management.

## Core lifecycle

Customer → Instrument → VCID Stock → Certificate → Issue → Billing → Renewal / Recall

## Local run

### 1) MongoDB
Use local MongoDB or MongoDB Atlas.

### 2) Backend

```bash
cd backend
npm install
npm run dev
```

Default API: `http://localhost:5000`

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend: `http://localhost:5173/`

## Environment

Copy `backend/.env.example` to `backend/.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vc_certificate_management
JWT_SECRET=change-me
ADMIN_EMAIL=admin@vcmanagement.com
ADMIN_PASSWORD=admin123
```

For the frontend, `frontend/.env` may contain:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo login

Email: `admin@vcmanagement.com`
Password: `admin123`

The backend bootstraps the Admin account when MongoDB is empty. Business data starts empty.

## Production

- Deploy `backend` as a Node/Express service.
- Deploy `frontend` as a Vite site (Netlify works well).
- Set `VITE_API_URL` to the public backend URL + `/api`.
- Keep secrets out of Git.
