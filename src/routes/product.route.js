import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import {
  countProduct,
  createProduct,
  deleteProduct,
  filterProduct,
  getAllOrder,
  getAllProduct,
  getProductByCategory,
  getSimilarProduct,
  getSingleProduct,
  getToken,
  getUserAllOrder,
  listProduct,
  makePayment,
  searchProduct,
  updateProduct,
  updateStatus,
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
productRoute.route("/search-product/:searchName").get(verifyJWT, searchProduct);
productRoute.route("/single-product/:slug").get(verifyJWT, getSingleProduct);
productRoute
  .route("/similar-product/:productId/:categoryId")
  .get(verifyJWT, getSimilarProduct);
productRoute
  .route("/get-product-by-category/:slug")
  .get(verifyJWT, getProductByCategory);
productRoute.route("/get-token").get(verifyJWT, getToken);
productRoute.route("/make-payment").post(verifyJWT, makePayment);
productRoute.route("/get-user-order").get(verifyJWT, getUserAllOrder);
productRoute.route("/get-all-order").get(verifyJWT, isAdmin, getAllOrder);
productRoute
  .route("/update-order/:orderId")
  .patch(verifyJWT, isAdmin, updateStatus);

export default productRoute;
