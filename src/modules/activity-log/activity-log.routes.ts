import { Router } from "express";
import ActivityLogController from "./activity-log.controller";

const activityLogController = new ActivityLogController();
const router = Router();

router.get("/:id", activityLogController.getAllActivities);
router.post("/", activityLogController.createActivity);

export default router;
