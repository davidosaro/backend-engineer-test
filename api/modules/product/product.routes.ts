import { Router } from "express";
import ProductController from "./product.controller";
import { productCreationSchema, getProductSchema, getProductsSchema, updateProductSchema, addStockSchema, refundProductSchema, purchaseProductSchema } from "./product.validator";
import { createValidator } from "express-joi-validation";

const productController = new ProductController();
const router = Router();
const validator = createValidator({ passError: true });

router.post("/", validator.body(productCreationSchema), productController.createProduct);
// router.get("/:id", validator.params(getProductSchema), productController.getProductById);
// router.get("/", validator.query(getProductsSchema), productController.getAllProducts);
// router.put("/:id", validator.params(getProductSchema), validator.body(updateProductSchema), productController.updateProduct);
// router.delete("/:id", validator.params(getProductSchema), productController.deleteProduct);
// router.patch("/:id/stocks/restore", validator.params(getProductSchema), validator.body(addStockSchema), productController.restore);
// router.patch("/:id/stocks/", validator.params(getProductSchema), validator.body(addStockSchema), productController.addStock);
// router.post("/returns", validator.body(refundProductSchema), productController.returnProduct);
// router.post("/purchase", validator.body(purchaseProductSchema), productController.purchaseProduct);

export default router;
