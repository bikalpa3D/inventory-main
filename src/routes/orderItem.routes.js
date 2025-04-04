import {
    addToOrderItem,
    updateQuantity,
    deleteOrderItem,
    getAllOrderItems,
  } from "../controllers/orderItem.controller.js";
  import { verifyJWT } from "../middleware/auth.middleware.js";
  import { Router } from "express";
  
  const router = Router();
  
  router.use(verifyJWT);
  router.route("/").get(getAllOrderItems);
  router.route("/add").post(addToOrderItem);
  router.route("/update/:orderItemId").put(updateQuantity);
  router.route("/delete/:orderItemId").delete(deleteOrderItem);
  
  export default router;
  