const express = require("express");
const connectDB = require("./configs/db.config");
require("dotenv").config();
const app = express();





//START SERVER
const startSever = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`App runing on http://localhost:${process.env.PORT}/`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
startSever();
