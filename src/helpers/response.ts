import { Response } from "express";
import { IResponseData } from "./interfaces";
import AppError from "./errors/app-error";
import { RESPONSE_MESSAGES, HttpStatus } from "./constants";
import { ValidationError, ValidationErrorItem } from "joi";

export const errorResponse = (res: Response, err: Partial<AppError> | any) => {
  const errorMessage = err?.message || (err?.error instanceof ValidationError ? "Validation Error" : RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
  const errorStatusCode = err?.statusCode || (err?.error instanceof ValidationError ? 400 : HttpStatus.INTERNAL_SERVER_ERROR);

  // Handle validation errors
  const errors = err?.error?.details?.map((detail: ValidationErrorItem) => ({
    field: detail.context?.key || "unknown",
    message: detail.message,
  }));

  // Return error
  return res.status(errorStatusCode).json({
    status: "error",
    error: errorMessage,
    errors,
  });
};

export const successResponse = (res: Response, statusCode: number, data: IResponseData) => {
  const { message, data: responseData } = data;

  // Return success response
  return res.status(statusCode).json({
    status: "success",
    message,
    data: responseData,
  });
};
