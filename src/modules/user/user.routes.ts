import { Router } from "express";
import UserController from "./user.controller";
import { userCreationSchema, loginSchema } from "./user.validator";
import { createValidator } from "express-joi-validation";

const userController = new UserController();
const router = Router();
const validator = createValidator({ passError: true });

router.post("/", validator.body(userCreationSchema), userController.registerUser);
router.post("/login", validator.body(loginSchema), userController.loginUser);

export default router;
