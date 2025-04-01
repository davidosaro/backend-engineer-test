import { Response, NextFunction } from "express";
import { RESPONSE_MESSAGES } from "../helpers/constants";
import { UnauthorizedError } from "../helpers/errors";
import { verifyToken } from "../helpers/jwt";
import { IUserCredentials, RequestWithAdditions } from "../helpers/interfaces";
import UserService from "../modules/user/user.service";

const userService = new UserService();

export const authenticateUser = async (req: RequestWithAdditions, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1] || "";

    if (!token) {
      throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_TOKEN);
    }
    const decodedData = await verifyToken(token);
    const { id } = decodedData as IUserCredentials;

    const user = await userService.validateUser(id);
    req.user = user;
    next();
  } catch (error: any) {
    const err = new UnauthorizedError(`${RESPONSE_MESSAGES.INVALID_CREDENTIALS}: ${error.message}`);
    next(err);
  }
};
