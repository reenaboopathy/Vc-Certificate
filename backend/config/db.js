const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.log("MongoDB URI not configured. Using empty local JSON storage for development only.");
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Using empty local JSON storage for development only.", error.message);
    return false;
  }
}
module.exports = connectDB;
