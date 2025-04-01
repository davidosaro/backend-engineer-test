import UserService from "../../modules/user/user.service";
import UserRepository from "../../modules/user/user.repository";
import bcrypt from "bcryptjs";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../../helpers/errors";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import { generateToken, generateRefreshToken } from "../../helpers/jwt";
import { IUserModel } from "../../helpers/interfaces";

jest.mock("../../modules/user/user.repository");
jest.mock("bcryptjs");
jest.mock("../../helpers/jwt");

describe("UserService Test Suite", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    userService.userRepository = userRepositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should successfully register a new user", async () => {
      const mockUser = { _id: "1", username: "testuser", email: "test@example.com", password: "hashedpassword" };

      userRepositoryMock.create.mockResolvedValue(mockUser as IUserModel);
      userRepositoryMock.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      const newUser = await userService.registerUser({ username: "testuser", email: "test@example.com", password: "password" });

      expect(userRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({ username: "testuser", email: "test@example.com", password: "hashedpassword" }));
      expect(newUser).toEqual(mockUser);
    });

    it("should throw error if username already exists", async () => {
      userRepositoryMock.findOne.mockResolvedValue({ _id: "1", username: "testuser" } as IUserModel);

      await expect(userService.registerUser({ username: "testuser", email: "test@example.com", password: "password" })).rejects.toThrow(new BadRequestError(RESPONSE_MESSAGES.USERNAME_EXISTS));

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ username: "testuser" });
    });

    it("should throw error if email already exists", async () => {
      userRepositoryMock.findOne.mockResolvedValueOnce(null);
      userRepositoryMock.findOne.mockResolvedValueOnce({ _id: "1", email: "test@example.com" } as IUserModel);

      await expect(userService.registerUser({ username: "testuser", email: "test@example.com", password: "password" })).rejects.toThrow(new BadRequestError(RESPONSE_MESSAGES.EMAIL_EXISTS));

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    });
  });

  describe("loginUser", () => {
    it("should log in user successfully and return tokens", async () => {
      const mockUser = { _id: "1", email: "test@example.com", password: "hashedpassword", role: "ADMIN" };

      userRepositoryMock.findOne.mockResolvedValue(mockUser as IUserModel);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("access-token");
      (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

      const tokens = await userService.loginUser({ email: "test@example.com", password: "password" });

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(tokens).toEqual({ access: "access-token", refresh: "refresh-token" });
    });

    it("should throw error if user not found", async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(userService.loginUser({ email: "test@example.com", password: "password" })).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
    });

    it("should throw error if password is incorrect", async () => {
      const mockUser = { email: "test@example.com", password: "hashedpassword" };

      userRepositoryMock.findOne.mockResolvedValue(mockUser as IUserModel);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.loginUser({ email: "test@example.com", password: "wrongpassword" })).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
    });
  });

  describe("validateUser", () => {
    it("should return user if found", async () => {
      const mockUser = { id: "1", username: "testuser" };
      userRepositoryMock.findById.mockResolvedValue(mockUser as IUserModel);

      const user = await userService.validateUser("1");

      expect(userRepositoryMock.findById).toHaveBeenCalledWith("1");
      expect(user).toEqual(mockUser);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userService.validateUser("1")).rejects.toThrow(new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND));
    });
  });

  describe("checkIfUserExists", () => {
    it("should return true if user exists", async () => {
      userRepositoryMock.findOne.mockResolvedValue({ _id: "1" } as IUserModel);

      const exists = await userService.checkIfUserExists({ email: "test@example.com" });

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(exists).toBe(true);
    });

    it("should return false if user does not exist", async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      const exists = await userService.checkIfUserExists({ email: "test@example.com" });

      expect(exists).toBe(false);
    });
  });
});
