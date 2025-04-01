import ProductRepository from "../../modules/product/product.repository";
import productModel from "../../modules/product/product.model";
import { IProductModel } from "../../helpers/interfaces";

jest.mock("../../modules/product/product.model");

describe("ProductRepository", () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOne", () => {
    it("should return a product when found", async () => {
      const productData: Partial<IProductModel> = { id: "123", name: "Product 1", isDeleted: false };
      (productModel.findOne as jest.Mock).mockResolvedValue(productData);

      const result = await productRepository.findOne({ id: "123" });
      expect(result).toEqual(productData);
      expect(productModel.findOne).toHaveBeenCalledWith({ id: "123", isDeleted: false });
    });

    it("should return null if no product is found", async () => {
      (productModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await productRepository.findOne({ id: "999" });
      expect(result).toBeNull();
      expect(productModel.findOne).toHaveBeenCalledWith({ id: "999", isDeleted: false });
    });
  });

  describe("findById", () => {
    it("should return a product when found by id", async () => {
      const productData: Partial<IProductModel> = { id: "123", name: "Product 1", isDeleted: false };
      (productModel.findOne as jest.Mock).mockResolvedValue(productData);

      const result = await productRepository.findById("123");
      expect(result).toEqual(productData);
      expect(productModel.findOne).toHaveBeenCalledWith({ id: "123", isDeleted: false });
    });

    it("should return null if no product is found by id", async () => {
      (productModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await productRepository.findById("999");
      expect(result).toBeNull();
      expect(productModel.findOne).toHaveBeenCalledWith({ id: "999", isDeleted: false });
    });
  });

  describe("findAll", () => {
    const mockProducts = [
      { id: 1, name: "Product 1", price: 100 },
      { id: 2, name: "Product 2", price: 200 },
    ];

    const offset = 0;
    const limit = 2;
    const filter = {};
    const whereCase = {};

    it("should return products with pagination", async () => {
      const findMock = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockProducts),
      });

      productModel.find = findMock;

      const productRepo = new ProductRepository();
      const result = await productRepo.findAll(filter, { offset, limit, whereCase });

      expect(result).toEqual(mockProducts);
      expect(findMock).toHaveBeenCalledWith({ ...filter, ...whereCase });
      expect(findMock().skip).toHaveBeenCalledWith(offset);
      expect(findMock().limit).toHaveBeenCalledWith(limit);
    });

    it("should return an empty array if no products match the filter", async () => {
      const findMock = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue([]),
      });

      productModel.find = findMock;

      const productRepo = new ProductRepository();
      const result = await productRepo.findAll(filter, { offset, limit, whereCase });

      expect(result).toEqual([]);
      expect(findMock).toHaveBeenCalledWith({ ...filter, ...whereCase });
      expect(findMock().skip).toHaveBeenCalledWith(offset);
      expect(findMock().limit).toHaveBeenCalledWith(limit);
    });
  });
});
