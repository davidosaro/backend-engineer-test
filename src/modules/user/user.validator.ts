import Joi from "joi";

export const userCreationSchema = Joi.object({
  username: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
