import mongoose, { Schema, Model } from "mongoose";
import { trimModel } from "../../helpers";
import { IProductModel } from "../../helpers/interfaces";
import { ProductStatus } from "../../helpers/enums";

const ProductSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String }],
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    stock: { type: Number, default: 0, min: 0 },
    quantityAvailable: { type: Number, default: 0, min: 0 },
    quantityDamaged: { type: Number, default: 0, min: 0 },
    quantityReturned: { type: Number, default: 0, min: 0 },
    quantitySold: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ProductStatus, default: ProductStatus.AVAILABLE },
    images: [{ type: Array }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: String },
  },
  {
    timestamps: true,
    toJSON: trimModel(),
  }
);

const ProductModel: Model<IProductModel> = mongoose.model<IProductModel>("Product", ProductSchema);
export default ProductModel;
