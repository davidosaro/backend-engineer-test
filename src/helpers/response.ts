import { Response } from "express";
import { IResponseData } from "./interfaces";

export const errorResponse = (res: Response, statusCode: number, message: String) => {
  return res.status(statusCode).json({
    status: "error",
    error: message,
  });
};

export const successResponse = (res: Response, statusCode: number, data: IResponseData) => {
  const { message, data: responseData } = data;
  return res.status(statusCode).json({
    status: "success",
    message,
    responseData,
  });
};
