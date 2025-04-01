import ProductService from "../../modules/product/product.service";
import ProductRepository from "../../modules/product/product.repository";
import StoreService from "../../modules/store/store.service";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import { ProductStatus, ProductReturnType } from "../../helpers/enums";
import { BadRequestError, ConflictError, NotFoundError } from "../../helpers/errors";
import { IProductModel } from "../../helpers/interfaces";
import { ObjectId } from "mongoose";

jest.mock("../../modules/product/product.repository");
jest.mock("../../modules/store/store.service");

describe("ProductService", () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;
  let storeService: jest.Mocked<StoreService>;

  beforeEach(() => {
    productRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    storeService = new StoreService() as jest.Mocked<StoreService>;
    productService = new ProductService();
    productService.productRepository = productRepository;
    productService.storeService = storeService;
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const productData: Partial<IProductModel> = { name: "Product A", storeId: "67eab381a410180b87d980a0" as unknown as ObjectId, stock: 10 };
      productRepository.create = jest.fn().mockResolvedValue({ ...productData, quantityAvailable: 10 });
      storeService.checkIfStoreExists = jest.fn().mockResolvedValue(true);
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await productService.createProduct(productData, { username: "testUser" });
      expect(result).toHaveProperty("name", "Product A");
      expect(result).toHaveProperty("quantityAvailable", 10);
    });

    it("should throw error if product exists", async () => {
      const productData: Partial<IProductModel> = { name: "Product A", storeId: "67eab381a410180b87d980a0" as unknown as ObjectId, stock: 10 };
      productRepository.findOne = jest.fn().mockResolvedValue(true);

      await expect(productService.createProduct(productData)).rejects.toThrow(new ConflictError(RESPONSE_MESSAGES.PRODUCT_EXISTS));
    });

    it("should throw error if store does not exist", async () => {
      const productData: Partial<IProductModel> = { name: "Product A", storeId: "67eab381a410180b87d980a0" as unknown as ObjectId, stock: 10 };
      productRepository.findOne = jest.fn().mockResolvedValue(null);
      storeService.checkIfStoreExists = jest.fn().mockResolvedValue(false);

      await expect(productService.createProduct(productData)).rejects.toThrow(new NotFoundError(RESPONSE_MESSAGES.STORE_NOT_FOUND));
    });
  });

  describe("updateProduct", () => {
    it("should update the product", async () => {
      const productData: Partial<IProductModel> = { name: "Updated Product" };
      const existingProduct = { _id: "1", name: "Product A" };
      productRepository.findOne = jest.fn().mockResolvedValue(existingProduct);
      productRepository.updateOne = jest.fn().mockResolvedValue({});
      productService.checkIfProductExists = jest.fn().mockResolvedValue(true);
      productService.checkIfProductNameExists = jest.fn().mockResolvedValue(false);

      const result = await productService.updateProduct("1", productData);
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1" }, productData);
    });

    it("should throw error if product does not exist", async () => {
      const productData: Partial<IProductModel> = { name: "Updated Product" };
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(productService.updateProduct("1", productData)).rejects.toThrowError(NotFoundError);
    });

    it("should throw error if product name exists", async () => {
      const productData: Partial<IProductModel> = { name: "Product A" };
      productRepository.findOne = jest.fn().mockResolvedValue(true);

      await expect(productService.updateProduct("1", productData)).rejects.toThrowError(ConflictError);
    });
  });

  describe("deleteProduct", () => {
    it("should delete the product", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1" });
      productRepository.updateOne = jest.fn().mockResolvedValue({});

      const result = await productService.deleteProduct("1");
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1", status: ProductStatus.DELETED }, { isDeleted: true });
    });

    it("should throw error if product does not exist", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(productService.deleteProduct("1")).rejects.toThrowError(NotFoundError);
    });
  });

  describe("addStock", () => {
    it("should add stock to the product", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityAvailable: 10 });
      productRepository.updateOne = jest.fn().mockResolvedValue({});

      const result = await productService.addStock("1", 5);
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1" }, { $inc: { stock: 5, quantityAvailable: 5 }, status: ProductStatus.AVAILABLE });
    });

    it("should throw error if product does not exist", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(productService.addStock("1", 5)).rejects.toThrowError(NotFoundError);
    });
  });

  describe("restore", () => {
    it("should restore the product stock", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityReturned: 10 });
      productRepository.updateOne = jest.fn().mockResolvedValue({});

      const result = await productService.restore("1", 5);
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1" }, { $inc: { stock: 5, quantityAvailable: 5, quantityReturned: -5 } });
    });

    it("should throw error if insufficient quantity to restore", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityReturned: 3 });

      await expect(productService.restore("1", 5)).rejects.toThrowError(BadRequestError);
    });
  });

  describe("purchaseProduct", () => {
    it("should purchase a product", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityAvailable: 10 });
      productRepository.updateOne = jest.fn().mockResolvedValue({});

      const result = await productService.purchaseProduct({ productId: "1" as unknown as ObjectId, quantity: 5 });
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1" }, { $inc: { quantityAvailable: -5, quantitySold: 5 } });
    });

    it("should throw error if insufficient stock to purchase", async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityAvailable: 3 });

      await expect(productService.purchaseProduct({ productId: "1" as unknown as ObjectId, quantity: 5 })).rejects.toThrowError(BadRequestError);
    });
  });

  describe("getProductById", () => {
    it("should get the product by ID", async () => {
      productRepository.findById = jest.fn().mockResolvedValue({ _id: "1", name: "Product A" });

      const result = await productService.getProductById("1");
      expect(result).toHaveProperty("name", "Product A");
    });

    it("should throw error if product is not found", async () => {
      productRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(productService.getProductById("1")).rejects.toThrowError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);
    });
  });

  describe("returnProduct", () => {
    it("should return the product", async () => {
      const returnData = { productId: "1" as unknown as ObjectId, quantity: 5, reason: "Faulty", type: ProductReturnType.FAULTY };
      productRepository.findOne = jest.fn().mockResolvedValue({ _id: "1", quantityAvailable: 10 });
      productRepository.updateOne = jest.fn().mockResolvedValue({});

      const result = await productService.returnProduct(returnData);
      expect(result).toBeDefined();
      expect(productRepository.updateOne).toHaveBeenCalledWith({ _id: "1" }, { $inc: { quantityAvailable: -5, quantityReturned: 5 } });
    });

    it("should throw error if product is not found", async () => {
      const returnData = { productId: "1" as unknown as ObjectId, quantity: 5, reason: "Faulty", type: ProductReturnType.FAULTY };
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(productService.returnProduct(returnData)).rejects.toThrowError(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND);
    });
  });
});
