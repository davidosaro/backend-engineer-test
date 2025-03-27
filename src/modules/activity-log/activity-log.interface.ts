import { Document } from "mongoose";

export interface IActivityLogModel extends Document {
  userId: string;
  ref?: string;
  action: string;
}
