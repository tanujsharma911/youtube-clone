import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("👉 auth middleware :: Access token:", req.cookies?.accessToken);
        console.log("\n👉 auth middleware :: Refresh token:", req.cookies?.refreshToken);

        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        // Check token is not expired and valid
        const decoded = jwt.verify(token, process?.env?.ACCESS_TOKEN_SECRET);

        console.log("👉 auth middleware :: Decoded access token:", decoded);

        const user = await User.findById(decoded?.userId).select("-password -refreshTokens");

        if (!user) {
            throw new ApiError(401, "\nUnauthorized: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, `👉 auth middleware :: Unauthorized: User must be logged in - ${error?.message}`, error);
    }
});