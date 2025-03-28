import { Request, Response, NextFunction } from "express";
import { RESPONSE_MESSAGES } from "../helpers/constants";
import { ForbiddenError } from "../helpers/errors";
import { verifyToken } from "../helpers/jwt";
import { errorResponse } from "../helpers/response";
import { IUserCredentials } from "../helpers/interfaces";
import UserService from "../modules/user/user.service";

const userService = new UserService();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1] || "";

    if (!token) {
      throw new ForbiddenError(RESPONSE_MESSAGES.INVALID_TOKEN);
    }
    // token validity check
    const decodedData = await verifyToken(token);
    const { id } = decodedData as IUserCredentials;

    const user = await userService.validateUser(id);
    req.user = user;
    next();
  } catch (error: any) {
    const err = new ForbiddenError(`${RESPONSE_MESSAGES.INVALID_CREDENTIALS}: ${error.message}`);
    errorResponse(res, err);
  }
};
