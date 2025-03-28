import { Router } from "express";
import UserController from "./user.controller";
import { userCreationValidation, loginValidation } from "./user.validator";

const userController = new UserController();
const router = Router();

router.post("/", userCreationValidation, userController.registerUser);
router.post("/login", loginValidation, userController.loginUser);

export default router;
