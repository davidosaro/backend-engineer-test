import mongoose, { Schema, Model } from "mongoose";
import { IActivityLogModel } from "../../helpers/interfaces/index";
import { trimModel } from "../../helpers";

const ActivityLogSchema: Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    ref: { type: String },
    action: { type: String, required: true },
  },
  { timestamps: true, toJSON: trimModel() }
);

const ActivityLogModel: Model<IActivityLogModel> = mongoose.model<IActivityLogModel>("ActivityLog", ActivityLogSchema);
export default ActivityLogModel;
