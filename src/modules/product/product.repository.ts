import BaseRepository from "../../common/base.repository";
import productModel from "./product.model";
import { IGetProductsWhereCase, IPaginationQuery, IPaginationResponse, IProductModel } from "../../helpers/interfaces/index";
import { FilterQuery } from "mongoose";
import { getPagination } from "../../helpers";

export default class ProductRepository extends BaseRepository<IProductModel> {
  constructor() {
    super(productModel);
  }
  async findOne(filter: FilterQuery<IProductModel>): Promise<IProductModel | null> {
    return productModel.findOne({ ...filter, isDeleted: false });
  }
  async findById(id: string): Promise<IProductModel | null> {
    return productModel.findOne({ _id: id, isDeleted: false });
  }

  async findAll(filter: FilterQuery<IProductModel>, args: IPaginationQuery): Promise<IPaginationResponse> {
    const { limit = 10, offset = 0, whereCase, page = "1", size = "10" } = args;
    const products = await productModel
      .find({ ...filter, ...whereCase })
      .skip(offset)
      .limit(limit);

    const count = await productModel.countDocuments({ ...filter, ...whereCase });

    return getPagination({ rows: products, count }, page, size);
  }
}
