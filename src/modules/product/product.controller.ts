import { NextFunction, Request, Response } from "express";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";
import ProductService from "./product.service";
import { successResponse } from "../../helpers/response";
import { IGetProducts, RequestWithAdditions } from "../../helpers/interfaces";

export default class ProductController {
  productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: RequestWithAdditions, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.PRODUCT_CREATED,
        data: product,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCT_FETCHED,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  getAllProducts = async (req: Request<IGetProducts>, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts(req.query);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCTS_FETCHED,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: RequestWithAdditions, res: Response, next: NextFunction) => {
    try {
      await this.productService.updateProduct(req.params.id, req.body);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.PRODUCT_UPDATED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.PRODUCT_DELETED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  addStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.addStock(req.params.id, req.body.quantity);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCT_ADDED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  returnProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.returnProduct(req.body);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCT_REFUNDED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.restore(req.params.id, req.body.quantity);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCT_ADDED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  purchaseProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.purchaseProduct(req.body);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.PRODUCT_PURCHASED,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  // ... add more endpoints like bulk operations, document upload?
  // add activity logs
}
