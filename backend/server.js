const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
let mongoEnabled = true;
const recordSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const recordModels = new Map();
const mongoModel = (key) => { if (!recordModels.has(key)) recordModels.set(key, mongoose.model(`VC_${key}`, recordSchema, key)); return recordModels.get(key); };
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const resourceConfig = {
  customers: { file: "customers.json", label: "customers" },
  scales: { file: "scales.json", label: "scales" },
  certificates: { file: "certificates.json", label: "certificates" },
  renewals: { file: "renewals.json", label: "renewals" },
  followups: { file: "followups.json", label: "follow-ups" },
  payments: { file: "payments.json", label: "payments" },
  invoices: { file: "invoices.json", label: "invoices" },
  users: { file: "users.json", label: "users" },
};

for (const item of Object.values(resourceConfig)) {
  const file = path.join(dataDir, item.file);
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
}

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8") || "[]");
const writeJson = (name, value) => fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2));

function normalize(body) {
  const copy = { ...body };
  delete copy._id;
  delete copy.id;
  return copy;
}

function createCrudRouter(key) {
  const router = express.Router();
  const cfg = resourceConfig[key];
  router.get("/", async (req, res) => {
    try {
      let rows = await mongoModel(key).find().sort({ createdAt: -1 }).lean();
      const search = String(req.query.search || "").trim().toLowerCase();
      if (search) rows = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search));
      if (key === "users") rows = rows.map((row) => { const safe = { ...row }; delete safe.passwordHash; return safe; });
      res.json(rows);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.get("/:id", async (req, res) => {
    try {
      const row = await mongoModel(key).findById(req.params.id).lean();
      if (!row) return res.status(404).json({ message: `${cfg.label} record not found` });
      res.json(row);
    } catch (e) { res.status(404).json({ message: `${cfg.label} record not found` }); }
  });
  router.post("/", async (req, res) => {
    try {
      const payload = normalize(req.body);
      if (key === "users" && payload.password) {
        const bcrypt = require("bcryptjs");
        payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
        delete payload.password;
      }
      const row = await mongoModel(key).create(payload);
      const safe = row.toObject();
      if (key === "users") delete safe.passwordHash;
      res.status(201).json(safe);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.put("/:id", async (req, res) => {
    try {
      const payload = normalize(req.body);
      if (key === "users" && payload.password) {
        const bcrypt = require("bcryptjs");
        payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
        delete payload.password;
      }
      const row = await mongoModel(key).findByIdAndUpdate(req.params.id, payload, { new: true }).lean();
      if (!row) return res.status(404).json({ message: `${cfg.label} record not found` });
      if (key === "users") delete row.passwordHash;
      res.json(row);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const row = await mongoModel(key).findByIdAndDelete(req.params.id);
      if (!row) return res.status(404).json({ message: "Record not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  return router;
}

app.get("/", (req, res) => res.json({
  message: "VC Certificate Management System API is running",
  mode: process.env.MONGODB_URI || process.env.MONGO_URI ? "mongodb" : "local-json",
}));

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get("/api/auth/status", async (req, res) => {
  try {
    const users = await mongoModel("users").find().lean();
    res.json({ hasUsers: users.length > 0, database: mongoEnabled ? "mongodb" : "local-json" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post("/api/auth/setup", async (req, res) => {
  try {
    const { name, email, password, mobile = "" } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const users = await mongoModel("users").find().lean();
    if (users.length) return res.status(409).json({ message: "Initial setup is already completed. Please sign in." });
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);
    const payload = { name, email: String(email).trim().toLowerCase(), mobile, role: "Admin", status: "Active", passwordHash };
    const user = (await mongoModel("users").create(payload)).toObject();
    delete user.passwordHash;
    res.status(201).json({ user, message: "Admin account created. You can now sign in." });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await mongoModel("users").findById(req.user.sub).lean();
    if (!user || user.status === "Inactive") return res.status(401).json({ message: "Account is not active" });
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    res.json({ user: safeUser });
  } catch (e) {
    res.status(401).json({ message: "Authentication required" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const users = await mongoModel("users").find().lean();
    const user = users.find((u) => String(u.email).toLowerCase() === String(email).trim().toLowerCase());
    if (!user || user.status === "Inactive") return res.status(401).json({ message: "Invalid credentials or inactive account" });
    const bcrypt = require("bcryptjs");
    const valid = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });
    const safeUser = { ...user }; delete safeUser.passwordHash;
    const token = jwt.sign(
      { sub: String(user._id), email: user.email, role: user.role || "Admin" },
      process.env.JWT_SECRET || "vc_certificate_management_secret",
      { expiresIn: "8h" }
    );
    res.json({ user: safeUser, token });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

for (const key of Object.keys(resourceConfig)) {
  app.use(`/api/${key}`, requireAuth, createCrudRouter(key));
}

app.get("/api/dashboard", requireAuth, async (req, res) => {
  const read = async (key) => mongoModel(key).find().sort({createdAt:-1}).lean();
  const certificates = await read("certificates");
  const payments = await read("payments");
  const renewals = await read("renewals");
  const customers = await read("customers");
  const scales = await read("scales");
  const now = new Date();
  const days = (date) => Math.ceil((new Date(date) - now) / 86400000);
  const active = certificates.filter((c) => days(c.expiryDate) >= 0).length;
  const expiring = certificates.filter((c) => days(c.expiryDate) >= 0 && days(c.expiryDate) <= 30).length;
  const expired = certificates.filter((c) => days(c.expiryDate) < 0).length;
  const paid = payments.filter((p) => String(p.status).toLowerCase() === "paid");
  const revenue = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
  res.json({
    customers: customers.length,
    scales: scales.length,
    certificates: certificates.length,
    activeCertificates: active,
    expiringCertificates: expiring,
    expiredCertificates: expired,
    renewalsPending: renewals.filter((r) => String(r.status).toLowerCase() === "pending").length,
    revenue,
    recentCertificates: certificates.slice(0, 6),
    recentPayments: payments.slice(0, 6),
  });
});

app.get("/api/certificates/:id/pdf", requireAuth, async (req, res) => {
  const certificates = await mongoModel("certificates").find().lean();
  const c = certificates.find((x) => String(x._id) === String(req.params.id));
  if (!c) return res.status(404).json({ message: "Certificate not found" });
  const PDFDocument = require("pdfkit");
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${c.certificateNumber || "certificate"}.pdf"`);
  doc.pipe(res);
  doc.fontSize(22).fillColor("#17324d").text("VERIFICATION CERTIFICATE", { align: "center" });
  doc.moveDown(0.5).fontSize(11).fillColor("#64748b").text("VC Certificate Management System", { align: "center" });
  doc.moveDown(2);
  const rows = [
    ["Certificate Number", c.certificateNumber],
    ["Customer", c.customerName],
    ["Company / Shop", c.companyName],
    ["Scale ID", c.scaleId],
    ["Scale Type", c.scaleType],
    ["Capacity", c.capacity],
    ["Make", c.make],
    ["Model", c.model],
    ["Serial Number", c.serialNumber],
    ["Verification Date", c.verificationDate],
    ["Expiry Date", c.expiryDate],
    ["Status", c.status],
  ];
  rows.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text(label);
    doc.font("Helvetica").fontSize(12).fillColor("#0f172a").text(value || "-");
    doc.moveDown(0.65);
  });
  doc.moveDown(2).fontSize(9).fillColor("#64748b").text("Generated by VC Manager");
  doc.end();
});

const PORT = process.env.PORT || 5000;

async function bootstrapAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "admin@vcmanager.local").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "Admin@12345");
  const bcrypt = require("bcryptjs");
  const existing = await mongoModel("users").findOne({ email }).lean();
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await mongoModel("users").create({ name: process.env.ADMIN_NAME || "System Administrator", email, mobile: process.env.ADMIN_MOBILE || "", role: "Admin", status: "Active", passwordHash });
  console.log(`Initial admin account created for ${email}`);
}

connectDB()
  .then(() => bootstrapAdmin())
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (MongoDB)`)))
  .catch((error) => { console.error("Server startup failed:", error.message); process.exit(1); });
