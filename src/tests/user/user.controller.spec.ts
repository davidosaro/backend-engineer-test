import UserController from "../../modules/user/user.controller";
import UserService from "../../modules/user/user.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";

jest.mock("../../modules/user/user.service");

describe("UserController", () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    userController = new UserController();

    mockRequest = { body: {} };
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus } as Partial<Response>;
    mockNext = jest.fn();
  });

  describe("registerUser", () => {
    it("should register a user and return a success response", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };

      (UserService.prototype.registerUser as jest.Mock).mockResolvedValue(mockUser);
      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(UserService.prototype.registerUser).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.USER_CREATED,
        data: mockUser,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Registration failed");
      (UserService.prototype.registerUser as jest.Mock).mockRejectedValue(mockError);

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("loginUser", () => {
    it("should log in a user and return a success response", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com", token: "jwt-token" };

      (UserService.prototype.loginUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(UserService.prototype.loginUser).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.USER_LOGGED_IN,
        data: mockUser,
        status: "success",
      });
    });

    it("should pass errors to next() on failure", async () => {
      const mockError = new Error("Login failed");
      (UserService.prototype.loginUser as jest.Mock).mockRejectedValue(mockError);

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
