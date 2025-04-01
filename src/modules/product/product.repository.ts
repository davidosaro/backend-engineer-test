import BaseRepository from "../../common/base.repository";
import productModel from "./product.model";
import { IGetProductsWhereCase, IPaginationQuery, IProductModel } from "../../helpers/interfaces/index";
import { FilterQuery } from "mongoose";

export default class ProductRepository extends BaseRepository<IProductModel> {
  constructor() {
    super(productModel);
  }
  async findOne(filter: FilterQuery<IProductModel>): Promise<IProductModel | null> {
    return productModel.findOne({ ...filter, isDeleted: false }).exec();
  }
  async findById(id: string): Promise<IProductModel | null> {
    return productModel.findOne({ id, isDeleted: false }).exec();
  }

  async findAll(filter: FilterQuery<IProductModel>, args: IPaginationQuery) {
    const { limit, offset, whereCase } = args;
    return productModel
      .find({ ...filter, ...whereCase })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
