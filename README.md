# VC Certificate Management — Video-matched full-stack demo

This project displays the supplied demo UI in the frontend and adds a backend API for persistent demo records.

## Requirements
- Node.js 18+ (npm included)
- Windows PowerShell users: use `npm.cmd` if PowerShell blocks `npm.ps1`
- MongoDB is **not required for this demo**. Demo records are saved in `backend/data/demoData.json` until manually deleted.

## Run in VS Code
Open this folder in VS Code. Open two terminals.

### Terminal 1 — backend
```powershell
cd backend
npm.cmd install
npm.cmd run dev
```
Backend runs on `http://localhost:5000`.

### Terminal 2 — frontend
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## What works
- Video-matched demo UI
- Add/edit/delete customers, instruments, VCID stock, certificates and renewals
- Certificate creation automatically adds a renewal entry
- Renewal status actions and CSV report export
- Frontend synchronizes demo records with backend API; backend JSON persistence survives browser refresh/restart

## Important
This is a working local demo, not a deployed production system. Uploaded certificate files are stored as browser data URLs in demo records; keep demo uploads small (the UI enforces a 3 MB limit). The existing backend's MongoDB/auth CRUD routes are included from the source project, but this demo screen uses the dedicated `/api/demo-data` endpoint and JSON persistence.
