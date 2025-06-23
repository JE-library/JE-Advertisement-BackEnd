const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/JE-Advertisement-Web-App");
  console.log("DB connected Successfully!");
};

module.exports = connectDB;
