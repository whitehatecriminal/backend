import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandles.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findByPk(decodedToken?.id, {
            attributes: {
                exclude: ["password", "refreshToken"]
            }
        })
    
        if (!user) {
            // frontend
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next(); //work done
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid acces token")
    }

})