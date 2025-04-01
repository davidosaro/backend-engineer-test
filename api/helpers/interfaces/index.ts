import { Document, ObjectId } from "mongoose";
import { IProductSearchKey, ISort, ProductReturnType, ProductStatus, Role } from "../enums";
import { Request } from "express";
export interface IResponseData {
  data?: string | object | object[] | null;
  message?: string;
}
export interface IActivityLogModel extends Document {
  userId: string;
  ref?: string;
  action: string;
}

export interface IUserModel extends Document {
  username: string;
  password: string;
  email: string;
  role?: Role;
  _id: string;
}
export interface IStoreModel extends Document {
  name: string;
  description?: string;
  logo?: string;
  address?: string;
  createdBy?: string;
  ownerId?: string;
}

export interface IProductModel extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string[];
  storeId: ObjectId;
  stock?: number;
  status: ProductStatus;
  images?: string[];
  quantityAvailable?: number;
  quantityDamaged?: number;
  quantityReturned?: number;
  quantitySold?: number;
  createdBy?: string;
  isDeleted?: boolean;
}

export interface IGetProducts {
  page?: string;
  size?: string;
  storeId?: ObjectId;
  sort?: ISort;
  searchValue?: string;
  searchKey?: IProductSearchKey;
  status?: string;
}

export interface IProductReturn {
  productId: ObjectId;
  quantity: number;
  reason: string;
  type: ProductReturnType;
}
export interface IProductPurchase {
  productId: ObjectId;
  quantity: number;
}

export interface IUserCredentials {
  id: string;
  role: string;
}

export interface RequestWithAdditions extends Request {
  user?: IUserModel;
}

export interface IGetProductsWhereCase {
  deleted?: boolean;
  [key: string]: any;
}

export interface IPaginationQuery {
  limit?: number;
  offset?: number;
  whereCase?: IGetProductsWhereCase;
  page?: string;
  size?: string;
}

export interface IPaginationResponse {
  totalItems: number;
  records: IProductModel[];
  totalPages: number;
  currentPage: number;
}
