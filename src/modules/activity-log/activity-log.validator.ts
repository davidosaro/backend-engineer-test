import Joi from "joi";

export const activityCreationSchema = Joi.object({
  userId: Joi.string().guid().trim().required(),
  action: Joi.string().trim().required(),
  ref: Joi.string().trim().required(),
});

export const getActivitySchema = Joi.object({
  ref: Joi.string().trim().required(),
});
