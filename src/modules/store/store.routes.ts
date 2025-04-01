import { Router } from "express";
import StoreController from "./store.controller";
import { getStoreSchema, storeCreationSchema } from "./store.validator";
import { createValidator } from "express-joi-validation";

const storeController = new StoreController();
const router = Router();
const validator = createValidator({ passError: true });

router.post("/", validator.body(storeCreationSchema), storeController.createStore);
router.get("/:id", validator.params(getStoreSchema), storeController.getStoreById);

export default router;
