import Joi from "joi";

export const emailVerifySchema = Joi.object({
  email: Joi.string().email().required(),
});
