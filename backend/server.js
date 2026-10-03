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
let mongoEnabled = false;
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
  vcidStocks: { file: "vcidStocks.json", label: "VCID stock" },
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
      let rows = mongoEnabled ? await mongoModel(key).find().sort({ createdAt: -1 }).lean() : readJson(cfg.file);
      const search = String(req.query.search || "").trim().toLowerCase();
      if (search) rows = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search));
      if (key === "users") rows = rows.map((row) => { const safe = { ...row }; delete safe.passwordHash; return safe; });
      res.json(rows);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.get("/:id", async (req, res) => {
    try {
      const row = mongoEnabled ? await mongoModel(key).findById(req.params.id).lean() : readJson(cfg.file).find((x) => String(x._id) === String(req.params.id));
      if (!row) return res.status(404).json({ message: `${cfg.label} record not found` });
      res.json(row);
    } catch (e) { res.status(404).json({ message: `${cfg.label} record not found` }); }
  });
  router.post("/", async (req, res) => {
    try {
      const payload = normalize(req.body);
      if (key === "certificates") {
        if (!payload.vcid) return res.status(400).json({ message: "VCID is required" });
        const stocks = await getResourceRows("vcidStocks");
        const stock = stocks.find(x => String(x.vcid) === String(payload.vcid));
        if (!stock || String(stock.status || "Available").toLowerCase() !== "available") return res.status(400).json({ message: "Selected VCID is not available" });
        payload.status = payload.status || "Active";
        await setVcidStatus(payload.vcid, "Used");
      }
      if (key === "vcidStocks") {
        payload.status = "Available";
        const stocks = await getResourceRows("vcidStocks");
        if (stocks.some(x => String(x.vcid).trim().toLowerCase() === String(payload.vcid).trim().toLowerCase())) return res.status(409).json({ message: "VCID already exists" });
      }
      if (key === "users" && payload.password) {
        const bcrypt = require("bcryptjs");
        payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
        delete payload.password;
      }
      if (mongoEnabled) {
        const row = await mongoModel(key).create(payload);
        const safe = row.toObject(); delete safe.passwordHash;
        if (key === "certificates") await upsertRenewalFromCertificate(safe);
        return res.status(201).json(safe);
      }
      const rows = readJson(cfg.file), now = new Date().toISOString();
      const row = { _id: id(), ...payload, createdAt: now, updatedAt: now };
      rows.unshift(row); writeJson(cfg.file, rows);
      const safe = { ...row };
      if (key === "users") delete safe.passwordHash;
      if (key === "certificates") await upsertRenewalFromCertificate(safe);
      res.status(201).json(safe);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.put("/:id", async (req, res) => {
    try {
      if (mongoEnabled) {
        const previous = key === "certificates" ? await mongoModel(key).findById(req.params.id).lean() : null;
        const payload = normalize(req.body);
        if (key === "certificates") {
          if (!payload.vcid) return res.status(400).json({ message: "VCID is required" });
          const stocks = await getResourceRows("vcidStocks");
          const stock = stocks.find(x => String(x.vcid) === String(payload.vcid));
          if (!stock || (String(stock.status).toLowerCase() !== "available" && String(payload.vcid) !== String(previous?.vcid))) return res.status(400).json({ message: "Selected VCID is not available" });
          if (previous?.vcid && String(previous.vcid) !== String(payload.vcid)) await setVcidStatus(previous.vcid, "Available");
          await setVcidStatus(payload.vcid, "Used");
        }
        if (key === "users" && payload.password) {
          const bcrypt = require("bcryptjs");
          payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
          delete payload.password;
        }
        const row = await mongoModel(key).findByIdAndUpdate(req.params.id, payload, { new: true }).lean();
        if (!row) return res.status(404).json({ message: `${cfg.label} record not found` });
        if (key === "users") delete row.passwordHash;
        if (key === "certificates") await upsertRenewalFromCertificate(row);
        return res.json(row);
      }
      const rows = readJson(cfg.file), index = rows.findIndex((x) => String(x._id) === String(req.params.id));
      if (index === -1) return res.status(404).json({ message: `${cfg.label} record not found` });
      const previous = {...rows[index]};
      const payload = normalize(req.body);
      if (key === "certificates") {
        if (!payload.vcid) return res.status(400).json({ message: "VCID is required" });
        const stocks = readJson(resourceConfig.vcidStocks.file);
        const stock = stocks.find(x => String(x.vcid) === String(payload.vcid));
        if (!stock || (String(stock.status).toLowerCase() !== "available" && String(payload.vcid) !== String(previous.vcid))) return res.status(400).json({ message: "Selected VCID is not available" });
        if (previous.vcid && String(previous.vcid) !== String(payload.vcid)) { const old = stocks.find(x => String(x.vcid) === String(previous.vcid)); if (old) old.status = "Available"; }
        if (stock) stock.status = "Used"; writeJson(resourceConfig.vcidStocks.file, stocks);
      }
      if (key === "users" && payload.password) {
        const bcrypt = require("bcryptjs");
        payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
        delete payload.password;
      }
      rows[index] = { ...rows[index], ...payload, updatedAt: new Date().toISOString() };
      writeJson(cfg.file, rows);
      const safe = { ...rows[index] };
      if (key === "users") delete safe.passwordHash;
      if (key === "certificates") await upsertRenewalFromCertificate(safe);
      res.json(safe);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.delete("/:id", async (req, res) => {
    try {
      if (mongoEnabled) { const row = await mongoModel(key).findByIdAndDelete(req.params.id); if (!row) return res.status(404).json({message:"Record not found"}); if (key === "certificates" && row.vcid) await setVcidStatus(row.vcid, "Available"); if (key === "certificates" && row.certificateNumber) await removeRenewalForCertificate(row.certificateNumber); return res.json({message:"Deleted successfully"}); }
      const rows = readJson(cfg.file);
      const target = rows.find((x) => String(x._id) === String(req.params.id));
      const next = rows.filter((x) => String(x._id) !== String(req.params.id));
      if (next.length === rows.length) return res.status(404).json({ message: `${cfg.label} record not found` });
      writeJson(cfg.file, next);
      if (key === "certificates" && target?.vcid) await setVcidStatus(target.vcid, "Available");
      if (key === "certificates" && target?.certificateNumber) await removeRenewalForCertificate(target.certificateNumber);
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
    const users = mongoEnabled ? await mongoModel("users").find().lean() : readJson(resourceConfig.users.file);
    res.json({ hasUsers: users.length > 0, database: mongoEnabled ? "mongodb" : "local-json" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

async function getResourceRows(key) {
  const cfg = resourceConfig[key];
  return mongoEnabled ? await mongoModel(key).find().sort({ createdAt: -1 }).lean() : readJson(cfg.file);
}
async function replaceResourceRows(key, rows) {
  if (mongoEnabled) {
    await mongoModel(key).deleteMany({});
    if (rows.length) await mongoModel(key).insertMany(rows);
  } else writeJson(resourceConfig[key].file, rows);
}
async function setVcidStatus(vcid, status) {
  if (mongoEnabled) { await mongoModel("vcidStocks").findOneAndUpdate({vcid}, {status}, {new:true}); return; }
  const rows = readJson(resourceConfig.vcidStocks.file); const i = rows.findIndex(x => x.vcid === vcid); if (i >= 0) { rows[i].status = status; rows[i].updatedAt = new Date().toISOString(); writeJson(resourceConfig.vcidStocks.file, rows); }
}
async function upsertRenewalFromCertificate(c) {
  const customers = await getResourceRows("customers");
  const customer = customers.find(x => String(x.customerName || x.name || "").trim() === String(c.customerName || "").trim()) || {};
  const renewal = {
    certificateNumber: c.certificateNumber,
    customerName: c.customerName,
    customerMobile: customer.mobile || customer.phone || "",
    customerWhatsapp: customer.whatsapp || "",
    customerEmail: customer.email || "",
    expiryDate: c.expiryDate,
    followUpDate: c.expiryDate ? (() => { const d = new Date(c.expiryDate + "T00:00:00"); d.setDate(d.getDate() - 1); return d.toISOString().slice(0,10); })() : "",
    reminderDate: c.expiryDate ? (() => { const d = new Date(c.expiryDate + "T00:00:00"); d.setDate(d.getDate() - 1); return d.toISOString().slice(0,10); })() : "",
    reminderMessage: `Renewal reminder for ${c.customerName}. Contact: ${customer.mobile || customer.whatsapp || customer.email || "not available"}.`,
    status: "Pending",
    notes: "Automatically linked from certificate expiry. Reminder date is one day before expiry."
  };
  const rows = await getResourceRows("renewals");
  const i = rows.findIndex(x => String(x.certificateNumber) === String(c.certificateNumber));
  if (i >= 0) rows[i] = {...rows[i], ...renewal, updatedAt: new Date().toISOString()};
  else rows.unshift({_id:id(), ...renewal, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()});
  await replaceResourceRows("renewals", rows);
}
async function removeRenewalForCertificate(certificateNumber) {
  const rows = await getResourceRows("renewals");
  await replaceResourceRows("renewals", rows.filter(x => String(x.certificateNumber) !== String(certificateNumber)));
}

function certificatePreValidation(req, res, next) { next(); }

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const users = mongoEnabled ? await mongoModel("users").find().lean() : readJson(resourceConfig.users.file);
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
  const read = async (key) => mongoEnabled ? await mongoModel(key).find().sort({createdAt:-1}).lean() : readJson(resourceConfig[key].file);
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
  const certificates = mongoEnabled ? await mongoModel("certificates").find().lean() : readJson(resourceConfig.certificates.file);
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

// Development login bootstrap: guarantees the original Email + Password login
// works on a fresh MongoDB database while keeping all business records empty.
async function ensureAdminUser() {
  const email = String(process.env.ADMIN_EMAIL || "admin@vcmanagement.com").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "admin123");
  const bcrypt = require("bcryptjs");
  const passwordHash = await bcrypt.hash(password, 10);

  if (mongoEnabled) {
    const Users = mongoModel("users");
    const existing = await Users.findOne({ email });
    if (!existing) {
      await Users.create({
        name: "Admin",
        email,
        mobile: "",
        role: "Admin",
        status: "Active",
        passwordHash,
      });
      console.log(`Admin user created: ${email}`);
    } else {
      const valid = existing.passwordHash ? await bcrypt.compare(password, existing.passwordHash) : false;
      if (!valid || existing.status === "Inactive") {
        await Users.updateOne({ _id: existing._id }, { $set: { passwordHash, status: "Active", role: "Admin" } });
        console.log(`Admin user credentials refreshed: ${email}`);
      }
    }
    return;
  }

  const rows = readJson(resourceConfig.users.file);
  const index = rows.findIndex((u) => String(u.email).toLowerCase() === email);
  if (index === -1) {
    rows.unshift({ _id: id(), name: "Admin", email, mobile: "", role: "Admin", status: "Active", passwordHash });
  } else {
    rows[index] = { ...rows[index], name: "Admin", email, role: "Admin", status: "Active", passwordHash };
  }
  writeJson(resourceConfig.users.file, rows);
}

(async () => {
  try {
    const connected = await connectDB();
    mongoEnabled = Boolean(connected);
    await ensureAdminUser();
  } catch (error) {
    console.error("Startup initialization failed:", error.message);
  } finally {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (${mongoEnabled ? "MongoDB" : "local JSON"})`));
  }
})();
