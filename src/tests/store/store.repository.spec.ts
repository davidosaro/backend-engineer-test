import StoreRepository from "../../modules/store/store.repository";
import storeModel from "../../modules/store/store.model";
import { IStoreModel } from "../../helpers/interfaces";

jest.mock("../../modules/store/store.model", () => {
  return {
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };
});

describe("StoreRepository", () => {
  let storeRepository: StoreRepository;

  beforeEach(() => {
    storeRepository = new StoreRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should instantiate with the correct model", () => {
      expect(storeRepository).toBeInstanceOf(StoreRepository);
      expect(storeRepository["model"]).toBe(storeModel);
    });
  });

  describe("create", () => {
    it("should create a store when called with valid data", async () => {
      const mockData: Partial<IStoreModel> = {
        name: "Test Store",
        address: "Test address",
      };

      storeModel.create = jest.fn().mockResolvedValue(mockData);

      const result = await storeRepository.create(mockData);

      expect(storeModel.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it("should throw error if store creation fails", async () => {
      const mockData: Partial<IStoreModel> = {
        name: "Test Store",
        address: "Test address",
      };

      storeModel.create = jest.fn().mockRejectedValue(new Error("Failed to create store"));

      await expect(storeRepository.create(mockData)).rejects.toThrowError("Failed to create store");
    });
  });

  describe("find", () => {
    it("should find stores successfully", async () => {
      const mockStores: Partial<IStoreModel>[] = [
        { name: "Store 1", address: "address 1" },
        { name: "Store 2", address: "address 2" },
      ];

      storeModel.find = jest.fn().mockResolvedValue(mockStores);

      const result = await storeRepository.find({});

      expect(storeModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockStores);
    });

    it("should return empty array if no stores are found", async () => {
      storeModel.find = jest.fn().mockResolvedValue([]);

      const result = await storeRepository.find({});
      expect(storeModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("findOne", () => {
    it("should find a store by id successfully", async () => {
      const mockStore: Partial<IStoreModel> = { name: "Test Store", address: "Test address" };
      const storeId = "123";

      storeModel.findOne = jest.fn().mockResolvedValue(mockStore);

      const result = await storeRepository.findOne({ _id: storeId });

      expect(storeModel.findOne).toHaveBeenCalledWith({ _id: storeId });
      expect(result).toEqual(mockStore);
    });
  });

  describe("update", () => {
    it("should update the store details", async () => {
      const storeId = "123";
      const updateData: Partial<IStoreModel> = { address: "Updated address" };
      const updatedStore: Partial<IStoreModel> = { name: "Test Store", address: "Updated address" };

      storeModel.updateOne = jest.fn().mockResolvedValue(updatedStore);

      const result = await storeRepository.updateOne({ _id: storeId }, updateData);

      expect(storeModel.updateOne).toHaveBeenCalledWith({ _id: storeId }, updateData, { new: true });
      expect(result).toEqual(updatedStore);
    });
  });

  describe("delete", () => {
    it("should delete the store by id", async () => {
      const storeId = "123";

      storeModel.deleteOne = jest.fn().mockResolvedValue({});

      const result = await storeRepository.delete({ _id: storeId });

      expect(storeModel.deleteOne).toHaveBeenCalledWith({ _id: storeId });
      expect(result).toEqual({});
    });
  });
});
