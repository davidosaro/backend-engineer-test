import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from "../../helpers/jwt";
import { IUserCredentials } from "../../helpers/interfaces";
import { UnauthorizedError } from "../../helpers/errors";
import { accessKey, refreshKey } from "../../config";
import { RESPONSE_MESSAGES } from "../../helpers/constants";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("JWT Token Utility Functions", () => {
  const userObj: IUserCredentials = { id: "1", role: "user" };

  describe("generateToken function", () => {
    it("should generate a token", () => {
      const mockToken = "mocked-jwt-token";
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = generateToken(userObj);

      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(userObj, accessKey, { expiresIn: "1h" });
    });
  });

  describe("generateRefreshToken function", () => {
    it("should generate a refresh token", () => {
      const mockRefreshToken = "mocked-refresh-jwt-token";
      (jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken);

      const refreshToken = generateRefreshToken(userObj);

      expect(refreshToken).toBe(mockRefreshToken);
      expect(jwt.sign).toHaveBeenCalledWith(userObj, refreshKey, { expiresIn: "7d" });
    });
  });

  describe("verifyToken function", () => {
    it("should verify a valid token and return decoded payload", async () => {
      const mockDecoded = { username: "testuser", iat: 1625502000, exp: 1625505600 };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const token = "valid-token";
      const decoded = await verifyToken(token);

      expect(decoded).toBe(mockDecoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, accessKey);
    });

    it("should throw UnauthorizedError for an invalid token", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
      });

      const token = "invalid-token";

      await expect(verifyToken(token)).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
      await expect(verifyToken(token)).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
    });
  });

  describe("verifyRefreshToken function", () => {
    it("should verify a valid refresh token and return decoded payload", async () => {
      const mockDecoded = { username: "testuser", iat: 1625502000, exp: 1625505600 };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const refreshToken = "valid-refresh-token";
      const decoded = await verifyRefreshToken(refreshToken);

      expect(decoded).toBe(mockDecoded);
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, refreshKey);
    });

    it("should throw UnauthorizedError for an invalid refresh token", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
      });

      const refreshToken = "invalid-refresh-token";

      await expect(verifyRefreshToken(refreshToken)).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
      await expect(verifyRefreshToken(refreshToken)).rejects.toThrow(new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS));
    });

    it("should throw an error for an expired token", async () => {
      await expect(verifyToken("expired.token")).rejects.toThrow(jwt.TokenExpiredError);
    });
    it("should throw an error for an invalid refresh token", async () => {
      await expect(verifyRefreshToken("invalid.refresh.token")).rejects.toThrow(UnauthorizedError);
    });
  });
});
