import ApiError from "../utils/apiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const isAdmin = asyncHandler(async (req, res, next) => {

  if (req.user?.role !== "admin") {
    throw new ApiError(200, "Only admin can access create category");
  }
  next();
});

export default isAdmin;
