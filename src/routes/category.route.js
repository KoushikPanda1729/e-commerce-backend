import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";

const categoryRoute = Router();

categoryRoute
  .route("/create-category")
  .post(verifyJWT, isAdmin, createCategory);
categoryRoute
  .route("/update-category/:id")
  .patch(verifyJWT, isAdmin, updateCategory);
categoryRoute.route("/get-category").get(verifyJWT, isAdmin, getAllCategory);
categoryRoute
  .route("/delete-category/:id")
  .post(verifyJWT, isAdmin, deleteCategory);

export default categoryRoute;
