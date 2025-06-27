import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandles.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findByPk(decodedToken?.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
});
