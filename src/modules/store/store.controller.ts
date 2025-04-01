import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";
import { RequestWithAdditions } from "../../helpers/interfaces";
import { successResponse } from "../../helpers/response";
import StoreService from "./store.service";
import { NextFunction, Request, Response } from "express";

export default class StoreController {
  storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  createStore = async (req: RequestWithAdditions, res: Response, next: NextFunction) => {
    try {
      const loggedInUser = req.user;
      const store = await this.storeService.createStore(req.body, loggedInUser);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.STORE_CREATED,
        data: store,
      });
    } catch (err) {
      next(err);
    }
  };

  getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const store = await this.storeService.getStoreById(req.params.id);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.STORE_FETCHED,
        data: store,
      });
    } catch (err) {
      next(err);
    }
  };
  // updateStore = async (req: Request, res: Response, next: NextFunction) => {}
  // deleteStore = async (req: Request, res: Response, next: NextFunction) => {}
  // Implement other methods here...
}
