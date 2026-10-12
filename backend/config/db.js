const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production. Refusing to start with temporary local-file storage.");
    }
    console.log("MongoDB URI not configured. Using local JSON storage for development only.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected; records will be stored in the shared database.");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("MongoDB connection failed. Check MONGODB_URI and database network access. Startup stopped to prevent saving records to temporary storage.");
  }
}
module.exports = connectDB;
