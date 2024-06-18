import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRoute = Router();

productRoute
  .route("/create-product/:categoryId")
  .post(verifyJWT, isAdmin, upload.single("product-image"), createProduct);
productRoute
  .route("/update-product/:id")
  .patch(verifyJWT, isAdmin, upload.single("product-image"), updateProduct);
productRoute.route("/get-All-Product").get(verifyJWT, isAdmin, getAllProduct);
productRoute
  .route("/delete-product/:id")
  .post(verifyJWT, isAdmin, deleteProduct);

export default productRoute;
