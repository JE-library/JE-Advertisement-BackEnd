const joi = require("joi");

const signUpSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  //   confirmPassword: joi.string().ref("password")
  role: joi.string().valid("user", "vendor").required(),
});

const signInSchema = joi.object({
  usernameOrEmail: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid("user", "vendor").required(),
});

const addAdSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.string().required(),
  category: joi.string().required(),
});

module.exports = { signUpSchema, signInSchema, addAdSchema };
