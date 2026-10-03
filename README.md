# VC Certificate Management System — Original UI + Requested Small Changes

## What is included
- Original login UI: Email + Password only
- No sample customer/scale/VCID/certificate/renewal/payment/invoice/follow-up records
- Admin login is seeded so the original login flow works
- Customer-first flow for scales, certificates, renewals, payments, follow-ups and invoices
- Weighing Scales: Scale ID + Scale Name, Location removed
- Certificates: Add New VCID Stock, available-VCID selection, certification/expiry dates
- Certificate expiry automatically creates a renewal record with reminder date one day before expiry
- Mobile responsive UI

## Login
Email: `admin@vcmanagement.com`
Password: `admin123`

## Run in VS Code
### 1. Backend
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

## Data persistence
The bundled local JSON data files start empty for business records, so you can create everything yourself. Records remain after logout/login and remain until you delete them.

For shared/production persistence, add a real `MONGODB_URI` in `backend/.env`. Without MongoDB, the backend falls back to its local JSON store.
