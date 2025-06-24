const Users = require("../models/User");
const { signUpSchema, signInSchema } = require("../utils/joi.utils");
const { errorResponse, successResponse } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmail = require("../utils/sendEmail.utils");

// SIGNNING UP
const signUp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const { value, error } = signUpSchema.validate(req.body);
    if (error) {
      const message = errorResponse(
        error.details[0].message,
        value,
        error.details[0]
      );
      return res.status(400).json(message);
    }
    //checking if user already exists
    const matchedUSer = await Users.findOne({ $or: [{ username }, { email }] });
    if (matchedUSer) {
      const message = errorResponse(
        "Account with username / email already exists",
        null,
        true
      );
      return res.status(400).json(message);
    }

    //creating new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userID: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role,
    };
    //adding new user to db
    const response = await Users.create(newUser);
    //sending new user to client
    const message = successResponse(
      "Account Created Successfully, Check your inbox for a link to login! ",
      {
        userID: response.userID,
        username: response.username,
        email: response.email,
        role: response.role,
      }
    );
    res.status(201).json(message);
    //Send email and forget
    await sendEmail({ username, email });
  } catch (error) {
    console.log(error.message);
  }
};

//SIGNING IN
const signIn = async (req, res) => {
  try {
    const { usernameOrEmail, password, role } = req.body;
    const { value, error } = signInSchema.validate(req.body);
    if (error) {
      const message = errorResponse(
        error.details[0].message,
        value,
        error.details[0]
      );
      return res.status(404).json(message);
    }
    //checking if user exists
    const matchedUSer = await Users.findOne(
      {
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      { _id: 0, __v: 0 }
    );
    if (!matchedUSer) {
      const message = errorResponse("Invalid credentials!", null, true);
      return res.status(400).json(message);
    }

    //checking if passwords match
    const matchPassword = await bcrypt.compare(password, matchedUSer.password);
    if (!matchPassword) {
      const message = errorResponse("Invalid credentials!", null, true);
      return res.status(400).json(message);
    }
    //updating users role
    if (role !== matchedUSer.role) {
      await Users.updateOne(
        { userID: matchedUSer.userID },
        { $set: { role: role } }
      );
    }
    //generating token
    const userDetails = {
      userID: matchedUSer.userID,
      role: role,
      username: matchedUSer.username,
      email: matchedUSer.email,
    };
    const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY);
    //sending token to client
    const message = successResponse(
      `Hello ${usernameOrEmail}, you've successfully logged in as a ${role}.`,
      token
    );
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signUp, signIn };
