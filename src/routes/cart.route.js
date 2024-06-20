import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addToCart,
  decreaseQYT,
  deleteToCart,
  getAllCart,
  increaseQYT,
} from "../controllers/cart.controller.js";

const cartRoute = Router();
cartRoute.route("/create-cart/:slug").post(verifyJWT, addToCart);
cartRoute.route("/delete-cart/:productId").delete(verifyJWT, deleteToCart);
cartRoute.route("/increaseQYT-cart/:productId").patch(verifyJWT, increaseQYT);
cartRoute.route("/decreaseQYT-cart/:productId").patch(verifyJWT, decreaseQYT);
cartRoute.route("/get-all-cart").get(verifyJWT, getAllCart);
export default cartRoute;
