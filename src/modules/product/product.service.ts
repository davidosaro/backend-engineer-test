import { DeleteResult, FilterQuery, UpdateWriteOpResult } from "mongoose";
import { IGetProducts, IProductModel, IProductPurchase, IProductReturn, IUserModel } from "../../helpers/interfaces";
import ProductRepository from "./product.repository";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import StoreService from "../store/store.service";
import { PathParams } from "express-serve-static-core";
import { ProductReturnType, ProductStatus } from "../../helpers/enums";
import { BadRequestError, ConflictError, NotFoundError, UnprocessableEntityError } from "../../helpers/errors";
import { getPaginationQuery } from "../../helpers";

export default class ProductService {
  productRepository: ProductRepository;
  storeService: StoreService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.storeService = new StoreService();
  }

  async createProduct(data: Partial<IProductModel>, { username }: Partial<IUserModel> = {}): Promise<IProductModel> {
    const { name, storeId, stock } = data;
    const productExists = await this.checkIfProductExists({ name });
    if (productExists) throw new Error(RESPONSE_MESSAGES.PRODUCT_EXISTS);

    const storeExists = await this.storeService.checkIfStoreExists({ _id: storeId });
    if (!storeExists) throw new Error(RESPONSE_MESSAGES.STORE_NOT_FOUND);

    return this.productRepository.create({ ...data, quantityAvailable: stock, createdBy: username });
  }

  async updateProduct(id: string, data: Partial<IProductModel>): Promise<UpdateWriteOpResult> {
    const { name } = data;
    const productExists = await this.checkIfProductExists({ _id: id });
    if (!productExists) throw new NotFoundError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    const productNameExists = await this.checkIfProductExists({ name });
    if (productNameExists) throw new ConflictError(RESPONSE_MESSAGES.PRODUCT_EXISTS);

    return this.productRepository.updateOne({ _id: id }, data);
  }

  async deleteProduct(id: string): Promise<UpdateWriteOpResult> {
    const productExists = await this.checkIfProductExists({ _id: id });
    if (!productExists) throw new NotFoundError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    return this.productRepository.updateOne({ _id: id, status: ProductStatus.DELETED }, { isDeleted: true });
  }

  async addStock(id: string, quantity: number): Promise<UpdateWriteOpResult> {
    const productExists = await this.checkIfProductExists({ _id: id });
    if (!productExists) throw new NotFoundError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    return this.productRepository.updateOne({ _id: id }, { $inc: { stock: quantity, quantityAvailable: quantity }, status: ProductStatus.AVAILABLE });
  }

  async restore(id: string, quantity: number): Promise<UpdateWriteOpResult> {
    const productExists = await this.checkIfProductExists({ _id: id });
    if (!productExists) throw new NotFoundError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    const product = await this.productRepository.findOne({ _id: id });
    const productQuantity = product?.quantityReturned || 0;
    if (productQuantity - quantity < 0) throw new BadRequestError(RESPONSE_MESSAGES.PRODUCT_INSUFFICIENT);
    return this.productRepository.updateOne({ _id: id }, { $inc: { stock: quantity, quantityAvailable: quantity, quantityReturned: -quantity } });
  }

  async purchaseProduct(data: Partial<IProductPurchase>): Promise<UpdateWriteOpResult> {
    const { productId: _id, quantity = 0 } = data;
    const productExists = await this.checkIfProductExists({ _id });
    if (!productExists) throw new Error(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    const product = await this.productRepository.findOne({ _id });
    const productQuantity = product?.quantityAvailable || 0;
    if (quantity > productQuantity) throw new BadRequestError(RESPONSE_MESSAGES.PRODUCT_INSUFFICIENT);
    return this.productRepository.updateOne({ _id }, { $inc: { quantityAvailable: -quantity, quantitySold: quantity } });
  }

  async getProductById(id: string): Promise<IProductModel | null> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);
    return product;
  }

  async getAllProducts(query: any): Promise<IProductModel[]> {
    const { storeId } = query;
    return this.productRepository.findAll({ storeId }, getPaginationQuery(query));
  }

  async returnProduct(data: IProductReturn): Promise<UpdateWriteOpResult> {
    const { productId: _id, quantity, reason, type } = data;
    const productExists = await this.checkIfProductExists({ _id });
    if (!productExists) throw new Error(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);

    //validate quantity to be greater than 0
    const inc = type == ProductReturnType.FAULTY ? { quantityReturned: quantity } : { quantityDamaged: quantity };
    return this.productRepository.updateOne({ _id }, { $inc: { quantityAvailable: -quantity, ...inc } });
  }
  async checkIfProductExists(args: FilterQuery<IProductModel>) {
    const user = await this.productRepository.findOne(args);
    return !!user;
  }
}
