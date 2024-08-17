const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

//login validation
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

//contact validation
const contactSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().email().required(),
  photo: Joi.string().optional(),
});

module.exports = {
  userSchema,
  loginSchema,
  contactSchema,
};
