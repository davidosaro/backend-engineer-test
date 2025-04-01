import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../helpers/response";
import AppError from "../helpers/errors/app-error";

const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  errorResponse(res, err);
};

export default errorHandler;
