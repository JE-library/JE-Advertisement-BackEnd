const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db.config");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const vendorsRoutes = require("./routes/vendors.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./services/swagger-output.json");
require("dotenv").config();
const app = express();
// MIDDLEWARES
app.use(express.json())
// app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/vendor", vendorsRoutes);

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
