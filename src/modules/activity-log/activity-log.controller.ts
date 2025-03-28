import ActivityLogService from "./activity-log.service";
import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../helpers/response";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";

export default class ActivityLogController {
  activityLogService: ActivityLogService;
  constructor() {
    this.activityLogService = new ActivityLogService();
  }

  createActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activityLog = await this.activityLogService.createActivity(req.body);
      successResponse(res, HttpStatus.CREATED, {
        message: RESPONSE_MESSAGES.ACTIVITY_LOG_CREATED,
        data: activityLog,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  getAllActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ref } = req.params;
      const activities = await this.activityLogService.getAllActivities(ref);
      successResponse(res, HttpStatus.OK, {
        message: RESPONSE_MESSAGES.ACTIVITIES_FETCHED,
        data: activities,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}
