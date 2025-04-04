import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/category.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllCategories);
router.route("/create-category").post(createCategory);
router.route("/update-category/:categoryId").put(updateCategory);
router.route("/delete-category/:categoryId").delete(deleteCategory);
router.route("/:categoryId").get(getCategoryById);

export default router;
