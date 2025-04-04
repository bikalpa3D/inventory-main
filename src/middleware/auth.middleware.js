import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized or token not available");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { _id } = decodedToken;

    const user = await User.findById(_id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found or the token is invalid/expired");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      "Unauthorized or the token has expired" || error.message
    );
  }
});
