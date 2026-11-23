const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;