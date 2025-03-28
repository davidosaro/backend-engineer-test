import { Document } from "mongoose";
export interface IResponseData {
  data?: any;
  message?: string;
}
export interface IActivityLogModel extends Document {
  userId: string;
  ref?: string;
  action: string;
}
