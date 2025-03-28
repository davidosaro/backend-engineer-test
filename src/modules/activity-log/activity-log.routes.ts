import { Router } from "express";
import ActivityLogController from "./activity-log.controller";
import { activityLogCreationValidation, getActivitiesValidation } from "./activity-log.validator";

const activityLogController = new ActivityLogController();
const router = Router();

router.get("/:ref", getActivitiesValidation, activityLogController.getAllActivities);
router.post("/", activityLogCreationValidation, activityLogController.createActivity);

export default router;
