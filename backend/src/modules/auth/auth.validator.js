const Joi = require("joi");

// Password regex: at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,25}$/;

const RegisterUserDTO = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),

  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "Password must include uppercase, lowercase, number, and special character",
  }),

  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),

  gender: Joi.string().valid("male", "female", "other").default("other"),
 
});

const LoginUserDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  RegisterUserDTO,
  LoginUserDTO,
};
