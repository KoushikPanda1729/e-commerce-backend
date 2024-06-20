import slugify from "slugify";
import { Category } from "../models/category.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiRespose from "../utils/apiResponse.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (name.trim().length === 0) {
    throw new ApiError(400, "Name is required");
  }

  const existsCategory = await Category.findOne({
    $or: [{ name }],
  });

  if (existsCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const createCategory = await Category.create({
    name,
    slug: slugify(name),
  });
  res
    .status(200)
    .json(new ApiRespose(400, createCategory, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const findUpdatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      $set: { name, slug: slugify(name) },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(
      new ApiRespose(200, findUpdatedCategory, "Update category successfully")
    );
});

const getAllCategory = asyncHandler(async (_, res) => {
  const allCategory = await Category.find({});
  res
    .status(200)
    .json(new ApiRespose(200, allCategory, "Get all category successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteCategory = await Category.findByIdAndDelete(
    id,
    {
      $unset: { name: null },
    },
    {
      new: true,
    }
  );

  if (!deleteCategory) {
    throw new ApiError(400, "Category does not exists");
  }

  res
    .status(200)
    .json(new ApiRespose(200, {}, "Category deleted successfully"));
});

export { createCategory, updateCategory, getAllCategory, deleteCategory };
