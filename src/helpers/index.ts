import { validationResult } from "express-validator";
import { NextFunction, Response, Request } from "express";
import { HttpStatus } from "./constants";

export const trimModel = () => ({
  transform: (_doc: any, ret: Record<string, any>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    res.status(HttpStatus.BAD_REQUEST).json({ status: "error", errors: errorMessages });
    return;
  }
  next();
};
