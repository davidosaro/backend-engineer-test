import { body } from "express-validator";
import { validateInput } from "../../helpers";

export const userCreationValidation = [body("username").notEmpty().isString().withMessage("username is required"), body("email").isEmail().withMessage("email is required"), body("password").notEmpty().isString().withMessage("password is required"), validateInput];
export const loginValidation = [body("email").isEmail().withMessage("email is required"), body("password").notEmpty().isString().withMessage("password is required"), validateInput];
