import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import {
  countProduct,
  createProduct,
  deleteProduct,
  filterProduct,
  getAllProduct,
  listProduct,
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

productRoute.route("/filter-product").get(verifyJWT, filterProduct);
productRoute.route("/count-product").get(verifyJWT, countProduct);
productRoute.route("/list-product/:page").get(verifyJWT, listProduct);
export default productRoute;
