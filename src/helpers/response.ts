import { Response } from "express";
import { IResponseData } from "./interfaces";
import AppError from "./errors/app-error";
import { RESPONSE_MESSAGES, HttpStatus } from "./constants";

export const errorResponse = (res: Response, err: Partial<AppError> | any) => {
  const errorMessage = err?.message || RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR;
  const errorStatusCode = err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  return res.status(errorStatusCode).json({
    status: "error",
    error: errorMessage,
  });
};

export const successResponse = (res: Response, statusCode: number, data: IResponseData) => {
  const { message, data: responseData } = data;
  return res.status(statusCode).json({
    status: "success",
    message,
    data: responseData,
  });
};
