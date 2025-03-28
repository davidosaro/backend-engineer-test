import { body, param } from "express-validator";
import { validateInput } from "../../helpers";

export const activityLogCreationValidation = [body("userId").notEmpty().withMessage("userId is required").isUUID().withMessage("userId is expected to be a UUID"), body("action").notEmpty().withMessage("action is required"), body("ref").optional().isString().withMessage("ref is expected to be a string"), validateInput];
export const getActivitiesValidation = [param("ref").notEmpty().isUUID().withMessage("ref is required"), validateInput];
