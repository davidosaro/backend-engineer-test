import { Router } from "express";
import ActivityLogController from "./activity-log.controller";
import { activityLogCreationValidation } from "./activity-log.validator";

const activityLogController = new ActivityLogController();
const router = Router();

router.get("/:id", activityLogController.getAllActivities);
router.post("/", activityLogCreationValidation, activityLogController.createActivity);

export default router;
