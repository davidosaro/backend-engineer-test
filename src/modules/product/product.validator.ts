import Joi from "joi";
import { ProductReturnType } from "../../helpers/enums";

export const productCreationSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  price: Joi.number().min(0).required(),
  category: Joi.array().items(Joi.string().trim()),
  storeId: Joi.string().trim().required(),
  stock: Joi.number().min(0),
  images: Joi.array().items(Joi.string().trim()),
});

export const getProductSchema = Joi.object({
  id: Joi.string().hex().length(24).trim().required(),
});

export const getProductsSchema = Joi.object({
  page: Joi.string().trim(),
  size: Joi.string().trim(),
  storeId: Joi.string().hex().length(24).trim().required(),
  status: Joi.string().trim(),
  searchValue: Joi.string().trim(),
  searchKey: Joi.string().trim(),
  sort: Joi.string().trim(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  price: Joi.number().min(0),
  category: Joi.array().items(Joi.string().trim()),
});

export const addStockSchema = Joi.object({
  quantity: Joi.number().min(0),
});

export const refundProductSchema = Joi.object({
  productId: Joi.string().hex().length(24).trim().required(),
  quantity: Joi.number().min(0),
  reason: Joi.string().trim(),
  type: Joi.string()
    .valid(...Object.values(ProductReturnType))
    .trim(),
});

export const purchaseProductSchema = Joi.object({
  productId: Joi.string().hex().length(24).trim().required(),
  quantity: Joi.number().min(0),
});
