const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || process.env.DATABASE_URI;
    if (!connectionString) {
      throw new Error('Database connection string not found. Please set MONGO_URI in your .env file.');
    }
    const conn = await mongoose.connect(connectionString, {
      family: 4, // Force IPv4 to resolve querySrv ECONNREFUSED issues
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;