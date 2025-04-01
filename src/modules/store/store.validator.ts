import Joi from "joi";

export const storeCreationSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  logo: Joi.string().trim(),
  address: Joi.string().trim(),
});

export const getStoreSchema = Joi.object({
  id: Joi.string().trim().required(),
});
