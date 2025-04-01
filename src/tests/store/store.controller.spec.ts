import StoreController from "../../modules/store/store.controller";
import StoreService from "../../modules/store/store.service";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";
import { IStoreModel, IUserModel, RequestWithAdditions } from "../../helpers/interfaces";
import { Request, Response, NextFunction } from "express";

jest.mock("../../modules/store/store.service");

describe("StoreController", () => {
  let storeController: StoreController;
  let mockStoreService: jest.Mocked<StoreService>;
  let mockReq: Partial<RequestWithAdditions>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockStoreService = new StoreService() as jest.Mocked<StoreService>;
    storeController = new StoreController();
    (storeController as any).storeService = mockStoreService;

    mockReq = {
      body: { name: "Test Store" },
      user: { id: "user123", username: "Testusername" } as IUserModel,
      params: { id: "1" },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should create a store and return success response", async () => {
    const mockStore = { id: "1", name: "Test Store" };
    mockStoreService.createStore.mockResolvedValue(mockStore as IStoreModel);

    await storeController.createStore(mockReq as RequestWithAdditions, mockRes as Response, mockNext);

    expect(mockStoreService.createStore).toHaveBeenCalledWith(mockReq.body, mockReq.user);
    expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: RESPONSE_MESSAGES.STORE_CREATED,
      data: mockStore,
      status: "success",
    });
  });

  it("should return store details by ID", async () => {
    const mockStore = { id: "1", name: "Test Store" };
    mockStoreService.getStoreById.mockResolvedValue(mockStore as IStoreModel);

    await storeController.getStoreById(mockReq as RequestWithAdditions, mockRes as Response, mockNext);

    expect(mockStoreService.getStoreById).toHaveBeenCalledWith("1");
    expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: RESPONSE_MESSAGES.STORE_FETCHED,
      data: mockStore,
      status: "success",
    });
  });

  it("should call next with error if createStore fails", async () => {
    const mockError = new Error("Store creation failed");
    mockStoreService.createStore.mockRejectedValue(mockError);

    await storeController.createStore(mockReq as RequestWithAdditions, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("should call next with error if getStoreById fails", async () => {
    const mockError = new Error("Store not found");
    mockStoreService.getStoreById.mockRejectedValue(mockError);

    await storeController.getStoreById(mockReq as RequestWithAdditions, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
