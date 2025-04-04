import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  getProductByCategory,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/create-product").post(upload.single("image"), createProduct);
router
  .route("/update-product/:productId")
  .put(upload.single("image"), updateProduct);
router.route("/delete-product/:productId").delete(deleteProduct);
router.route("/").get(getAllProduct);
router.route("/:productId").get(getProductById);
router.route("/:categoryId").get(getProductByCategory);

export default router;
