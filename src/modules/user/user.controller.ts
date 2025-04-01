import UserService from "./user.service";
import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../helpers/response";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";

export default class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.registerUser(req.body);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.USER_CREATED,
        data: user,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.loginUser(req.body);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.USER_LOGGED_IN,
        data: user,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}
