import { Document } from "mongoose";
import { Role } from "../enums";
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
}

export interface IUserCredentials {
  id: string;
  role: string;
}

export interface RequestWithAdditions extends Request {
  user?: IUserModel;
}
