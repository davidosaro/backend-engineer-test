import { Response } from "express";
import { errorResponse, successResponse } from "../../helpers/response";
import AppError from "../../helpers/errors/app-error";
import { RESPONSE_MESSAGES, HttpStatus } from "../../helpers/constants";
import { ValidationError } from "joi";

jest.mock("../../helpers/errors/app-error");

describe("Response Handling", () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("errorResponse", () => {
    it("should return a general error response when no error details are provided", () => {
      const error = new AppError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
      errorResponse(mockRes as Response, error);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        error: "Internal Server Error",
        errors: undefined,
      });
    });

    it("should handle validation errors", () => {
      const mockValidationError = {
        message: "Validation Error",
        statusCode: 400,
        error: new ValidationError(
          "Validation failed",
          [
            {
              message: '"email" is required',
              path: ["email"],
              type: "any.required",
              context: { key: "email" },
            },
          ],
          "someDetails"
        ),
      };
      errorResponse(mockRes as Response, mockValidationError);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        error: "Validation Error",
        errors: [
          {
            field: "email",
            message: '"email" is required',
          },
        ],
      });
    });

    it("should return internal server error when error does not match validation", () => {
      const error = new AppError(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      errorResponse(mockRes as Response, error);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        error: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        errors: undefined,
      });
    });
  });

  describe("successResponse", () => {
    it("should return a success response with the given status code and data", () => {
      const responseData = {
        message: "Operation successful",
        data: { id: 1, name: "Product" },
      };

      successResponse(mockRes as Response, 200, responseData);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        message: "Operation successful",
        data: { id: 1, name: "Product" },
      });
    });
  });
});
