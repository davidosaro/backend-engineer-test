import mongoose, { Schema, Model } from "mongoose";
import { IUserModel } from "../../helpers/interfaces/index";
import { trimModel } from "../../helpers";
import { Role } from "../../helpers/enums";

const UserSchema: Schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true },
    role: { type: String, enum: Role, default: Role.ADMIN },
  },
  { timestamps: true, toJSON: trimModel() }
);

const UserModel: Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
export default UserModel;
