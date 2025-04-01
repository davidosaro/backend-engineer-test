import { FilterQuery } from "mongoose";
import { IStoreModel, IUserModel } from "../../helpers/interfaces";
import StoreService from "../../modules/store/store.service";
import StoreRepository from "../../modules/store/store.repository";
import UserService from "../../modules/user/user.service";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import { BadRequestError, ConflictError, NotFoundError } from "../../helpers/errors";

jest.mock("../../modules/store/store.repository");
jest.mock("../../modules/user/user.service");

describe("StoreService", () => {
  let storeService: StoreService;
  let storeRepositoryMock: jest.Mocked<StoreRepository>;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {
    storeRepositoryMock = new StoreRepository() as jest.Mocked<StoreRepository>;
    userServiceMock = new UserService() as jest.Mocked<UserService>;
    storeService = new StoreService();
    storeService.storeRepository = storeRepositoryMock;
    storeService.userService = userServiceMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createStore", () => {
    it("should throw an error if store already exists", async () => {
      storeRepositoryMock.findOne.mockResolvedValueOnce({} as IStoreModel);

      const data = { name: "Test Store" };
      const user = { username: "testuser", _id: "123" };

      await expect(storeService.createStore(data, user)).rejects.toThrow(new ConflictError(RESPONSE_MESSAGES.STORE_EXISTS));
      expect(storeRepositoryMock.findOne).toHaveBeenCalledWith({ name: "Test Store" });
    });

    it("should create a store if it does not exist", async () => {
      const data = { name: "Test Store" };
      const user = { username: "testuser", _id: "123" };

      storeRepositoryMock.findOne.mockResolvedValueOnce(null);
      storeRepositoryMock.create.mockResolvedValueOnce({ ...data, createdBy: "testuser", ownerId: "123" } as IStoreModel);

      const store = await storeService.createStore(data, user);

      expect(store).toHaveProperty("name", "Test Store");
      expect(store.createdBy).toBe("testuser");
      expect(store.ownerId).toBe("123");
      expect(storeRepositoryMock.create).toHaveBeenCalledWith({ ...data, createdBy: "testuser", ownerId: "123" });
    });

    it("should call validateUser and create a store", async () => {
      const data = { name: "Test Store" };
      const user = { username: "testuser", _id: "123" };
      storeRepositoryMock.findOne.mockResolvedValueOnce(null);
      userServiceMock.validateUser.mockResolvedValueOnce(user as IUserModel);

      await storeService.createStore(data, user);

      expect(userServiceMock.validateUser).toHaveBeenCalledWith("123");
      expect(storeRepositoryMock.create).toHaveBeenCalledWith({ ...data, createdBy: "testuser", ownerId: "123" });
    });
    it("should throw an error if user validation fails", async () => {
      const data = { name: "Test Store" };
      const user = { username: "testuser", _id: "123" };

      storeRepositoryMock.findOne.mockResolvedValueOnce(null);
      userServiceMock.validateUser.mockRejectedValueOnce(new Error("User validation failed"));

      await expect(storeService.createStore(data, user)).rejects.toThrow("User validation failed");

      expect(userServiceMock.validateUser).toHaveBeenCalledWith("123");
      expect(storeRepositoryMock.create).not.toHaveBeenCalled();
    });
    it("should throw an error if user ID is missing", async () => {
      const data = { name: "Test Store" };
      const user = { id: "wrong", name: "wrong" };
      userServiceMock.validateUser.mockRejectedValueOnce(new Error("User ID is missing"));
      await expect(storeService.createStore(data, user)).rejects.toThrow(new BadRequestError("User ID is missing"));
    });
  });

  describe("getStoreById", () => {
    it("should throw an error if store is not found", async () => {
      storeRepositoryMock.findById.mockResolvedValueOnce(null);

      await expect(storeService.getStoreById("123")).rejects.toThrow(new NotFoundError(RESPONSE_MESSAGES.STORE_NOT_FOUND));
      expect(storeRepositoryMock.findById).toHaveBeenCalledWith("123");
    });

    it("should return store if found", async () => {
      const storeMock: Partial<IStoreModel> = { name: "Test Store", createdBy: "testuser", ownerId: "123" };
      storeRepositoryMock.findById.mockResolvedValueOnce(storeMock as IStoreModel);

      const store = await storeService.getStoreById("123");

      expect(store).toEqual(storeMock);
      expect(storeRepositoryMock.findById).toHaveBeenCalledWith("123");
    });
    it("should throw an unexpected error if findById fails", async () => {
      storeRepositoryMock.findById.mockRejectedValueOnce(new Error("Database error"));

      await expect(storeService.getStoreById("123")).rejects.toThrow("Database error");

      expect(storeRepositoryMock.findById).toHaveBeenCalledWith("123");
    });
  });

  describe("checkIfStoreExists", () => {
    it("should return true if store exists", async () => {
      storeRepositoryMock.findOne.mockResolvedValueOnce({} as IStoreModel);

      const args: FilterQuery<IStoreModel> = { name: "Test Store" };
      const exists = await storeService.checkIfStoreExists(args);

      expect(exists).toBe(true);
      expect(storeRepositoryMock.findOne).toHaveBeenCalledWith(args);
    });

    it("should return false if store does not exist", async () => {
      storeRepositoryMock.findOne.mockResolvedValueOnce(null);

      const args: FilterQuery<IStoreModel> = { name: "Test Store" };
      const exists = await storeService.checkIfStoreExists(args);

      expect(exists).toBe(false);
      expect(storeRepositoryMock.findOne).toHaveBeenCalledWith(args);
    });
    it("should throw an error if findOne fails", async () => {
      storeRepositoryMock.findOne.mockRejectedValueOnce(new Error("Database error"));

      const args: FilterQuery<IStoreModel> = { name: "Test Store" };
      await expect(storeService.checkIfStoreExists(args)).rejects.toThrow("Database error");
    });
  });
});
