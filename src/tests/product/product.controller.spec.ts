import ProductController from "../../modules/product/product.controller";
import ProductService from "../../modules/product/product.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";
import { IUserModel, RequestWithAdditions } from "../../helpers/interfaces";

jest.mock("../../modules/product/product.service");

describe("ProductController", () => {
  let productController: ProductController;
  let mockRequest: Partial<RequestWithAdditions>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    productController = new ProductController();

    mockRequest = { body: {}, params: { id: "1" }, user: { id: "user123", username: "Testusername" } as IUserModel };
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus } as Partial<Response>;
    mockNext = jest.fn();
  });

  describe("createProduct", () => {
    it("should create a product and return a success response", async () => {
      const mockProduct = { id: 1, name: "Product A", price: 100 };

      (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      await productController.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.createProduct).toHaveBeenCalledWith(mockRequest.body, mockRequest.user);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCT_CREATED,
        data: mockProduct,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Product creation failed");
      (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(mockError);

      await productController.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getProductById", () => {
    it("should fetch a product by ID and return a success response", async () => {
      const mockProduct = { id: 1, name: "Product A", price: 100 };
      (ProductService.prototype.getProductById as jest.Mock).mockResolvedValue(mockProduct);

      await productController.getProductById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.getProductById).toHaveBeenCalledWith(mockRequest.params?.id);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCT_FETCHED,
        data: mockProduct,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Product fetch failed");
      (ProductService.prototype.getProductById as jest.Mock).mockRejectedValue(mockError);

      await productController.getProductById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getAllProducts", () => {
    it("should fetch all products and return a success response", async () => {
      const mockProducts = [
        { id: 1, name: "Product A", price: 100 },
        { id: 2, name: "Product B", price: 200 },
      ];

      (ProductService.prototype.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      await productController.getAllProducts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.getAllProducts).toHaveBeenCalledWith(mockRequest.query);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCTS_FETCHED,
        data: mockProducts,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Products fetch failed");
      (ProductService.prototype.getAllProducts as jest.Mock).mockRejectedValue(mockError);

      await productController.getAllProducts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateProduct", () => {
    it("should update a product and return a success response", async () => {
      const mockProduct = { id: 1, name: "Updated Product", price: 150 };

      (ProductService.prototype.updateProduct as jest.Mock).mockResolvedValue(mockProduct);

      await productController.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.updateProduct).toHaveBeenCalledWith(mockRequest.params?.id, mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCT_UPDATED,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Product update failed");
      (ProductService.prototype.updateProduct as jest.Mock).mockRejectedValue(mockError);

      await productController.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product and return a success response", async () => {
      (ProductService.prototype.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await productController.deleteProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.deleteProduct).toHaveBeenCalledWith(mockRequest.params?.id);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCT_DELETED,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Product deletion failed");
      (ProductService.prototype.deleteProduct as jest.Mock).mockRejectedValue(mockError);

      await productController.deleteProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("addStock", () => {
    it("should add stock and return a success response", async () => {
      (ProductService.prototype.addStock as jest.Mock).mockResolvedValue(undefined);

      await productController.addStock(mockRequest as Request, mockResponse as Response, mockNext);

      expect(ProductService.prototype.addStock).toHaveBeenCalledWith(mockRequest.params?.id, mockRequest.body.quantity);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.PRODUCT_ADDED,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Add stock failed");
      (ProductService.prototype.addStock as jest.Mock).mockRejectedValue(mockError);

      await productController.addStock(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
