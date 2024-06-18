import { Router } from "express";
import {
  forgotPassword,
  getUser,
  refreshAccessToken,
  updateAvatar,
  updateProfile,
  userLoggOut,
  userLogin,
  userRegister,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.route("/register").post(upload.single("avatar"), userRegister);
userRoute.route("/login").post(userLogin);
userRoute.route("/logout").post(verifyJWT, userLoggOut);
userRoute.route("/update-password").post(verifyJWT, updateProfile);
userRoute.route("/refresh").post(refreshAccessToken);
userRoute.route("/forgot").post(forgotPassword);
userRoute
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAvatar);
userRoute.route("/get-user").get(verifyJWT, getUser);
export default userRoute;
