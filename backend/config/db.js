const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGODB_URI is required. Configure MongoDB before starting the server.");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
  return true;
}

module.exports = connectDB;
