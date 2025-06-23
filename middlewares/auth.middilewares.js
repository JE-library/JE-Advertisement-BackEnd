const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    //checking if there is authorization in Request headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      const message = errorResponse(
        "Invalid or Missing auth Headers",
        null,
        true
      );
      return res.status(400).json(message);
    }
    //getting token from auth headers
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      const message = errorResponse("Token expired or Invalid", null, true);
      return res.status(400).json(message);
    }
    //adding user object to the request body
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
