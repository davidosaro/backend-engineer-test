import { Router } from "express";
import ActivityLogController from "./activity-log.controller";
import { activityCreationSchema, getActivitySchema } from "./activity-log.validator";
import { createValidator } from "express-joi-validation";

const activityLogController = new ActivityLogController();
const router = Router();
const validator = createValidator({ passError: true });

router.get("/:ref", validator.params(getActivitySchema), activityLogController.getAllActivities);
router.post("/", validator.body(activityCreationSchema), activityLogController.createActivity);

export default router;
