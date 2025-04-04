import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logOut,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWT, getMe);
router.route("/logout").get(verifyJWT, logOut);

export default router;
