import mongoose, { Schema, Model } from "mongoose";
import { IActivityLogModel } from "./activity-log.interface";

const ActivityLogSchema: Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    ref: { type: String },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

ActivityLogSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ActivityLogModel: Model<IActivityLogModel> = mongoose.model<IActivityLogModel>("ActivityLog", ActivityLogSchema);
export default ActivityLogModel;
