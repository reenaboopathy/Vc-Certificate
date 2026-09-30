const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "vc_certificate_management_secret");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}

module.exports = { requireAuth };
