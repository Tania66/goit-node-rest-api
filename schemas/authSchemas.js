import Joi from "joi";

export const registerUserJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

export const loginUserJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});
