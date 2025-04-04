import { Router } from "express";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
  getDiscountById,
} from "../controllers/discount.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/").get(getAllDiscounts);
router.route("/create-discount").post(createDiscount);
router.route("/update-discount/:discountId").put(updateDiscount);
router.route("/delete-discount/:discountId").delete(deleteDiscount);
router.route("/:discountId").get(getDiscountById);

export default router;
