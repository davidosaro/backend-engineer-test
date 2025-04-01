import mongoose, { Schema, Model } from "mongoose";
import { IStoreModel } from "../../helpers/interfaces";

const StoreSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    address: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
    ownerId: { type: String },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

const StoreModel: Model<IStoreModel> = mongoose.model<IStoreModel>("Store", StoreSchema);
export default StoreModel;
