import slugify from "slugify";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiRespose from "../utils/apiResponse.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import uploadOnCloudinary, {
  deleteOnCloudinary,
} from "../utils/cloudinary.util.js";
import { Category } from "../models/category.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { productName, title, description, price, stock } = req.body;
  const { categoryId } = req.params;
  const userId = req?.user?._id;

  if (
    [productName, title, description, price, stock].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!(userId && categoryId)) {
    throw new ApiError(400, "Userid and category id are required");
  }

  const existsProduct = await Product.findOne({
    $and: [{ productName }, { title }, { description }],
  });

  if (existsProduct) {
    throw new ApiError(400, "Product is already exists");
  }

  const productImageLocalPath = req?.file?.path;
  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image local path is missing");
  }

  const productImageURL = await uploadOnCloudinary(productImageLocalPath);

  if (!productImageURL?.url) {
    throw new ApiError(400, "Product image cloudinary path is missing");
  }

  const createProduct = await Product.create({
    productName,
    title,
    slug: slugify(productName),
    description,
    price,
    stock,
    owner: userId,
    porductImage: {
      url: productImageURL.url || "",
      public_id: productImageURL?.public_id,
    },
    category: categoryId,
  });

  res
    .status(200)
    .json(new ApiRespose(200, createProduct, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productName, title, description, price, stock } = req.body;
  const { id } = req.params;

  if (
    [productName, title, description, price, stock].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const productImageLocalPath = req?.file?.path;
  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image local path is missing");
  }

  const productImageURL = await uploadOnCloudinary(productImageLocalPath);

  if (!productImageURL?.url) {
    throw new ApiError(400, "Product image cloudinary path is missing");
  }
  const product = await Product.findById(id);
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        productName,
        title,
        slug: slugify(productName),
        description,
        price,
        stock,
        porductImage: {
          public_id: productImageURL.public_id,
          url: productImageURL.url,
        },
      },
    },
    {
      new: true,
    }
  );

  // console.log("Old>>", product?.porductImage?.url);
  // console.log("New>>", productImageURL?.url);
  await deleteOnCloudinary(product?.porductImage?.public_id);

  res
    .status(200)
    .json(new ApiRespose(200, updatedProduct, "User updated successfully"));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const allProduct = await Product.find({});
  res
    .status(200)
    .json(new ApiRespose(200, allProduct, "All product fetch successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  await deleteOnCloudinary(product?.porductImage?.public_id);
  await Product.findByIdAndDelete(id);
  res.status(200).json(new ApiRespose(200, {}, "Product delete successfully"));
});

const filterProduct = asyncHandler(async (req, res) => {
  try {
    let { categoryId, price } = req.body;
    console.log(categoryId);

    let arg = {};
    if (categoryId?.length > 0) {
      arg.category = categoryId;
    }
    if (price?.length) {
      arg.price = { $gte: price[0], $lte: price[1] };
    }

    const filterProduct = await Product.find(arg);

    return res
      .status(200)
      .json(
        new ApiRespose(200, filterProduct, "Product filtered successfully")
      );
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(new ApiError(400, "Product not filtered "));
  }
});

const countProduct = asyncHandler(async (req, res) => {
  try {
    const productCound = await Product.find({}).estimatedDocumentCount();
    return res
      .status(200)
      .json(new ApiRespose(200, productCound, "count successfull"));
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(new ApiError(400, "Product not filtered "));
  }
});

const listProduct = asyncHandler(async (req, res) => {
  const perPage = 2;
  let page = req?.params?.page || 1;
  const product = await Product.find({})
    .select("-porductImage")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiRespose(200, product, "count successfull"));
});

const searchProduct = asyncHandler(async (req, res) => {
  try {
    const { searchName } = req.params;

    const searchResult = await Product.find({
      $or: [
        { productName: { $regex: searchName, $options: "i" } },
        { description: { $regex: searchName, $options: "i" } },
      ],
    });
    return res
      .status(200)
      .json(new ApiRespose(200, searchResult, "count successfull"));
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(new ApiError(400, "Product not searched "));
  }
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const singleProduct = await Product.find({ slug });

  return res
    .status(200)
    .json(
      new ApiRespose(200, singleProduct, "single product fetched successfull")
    );
});

const getSimilarProduct = asyncHandler(async (req, res) => {
  const { productId, categoryId } = req.params;

  const similarProduct = await Product.find({
    category: categoryId,
    _id: { $ne: productId },
  })
    .limit(3)
    .populate("category");

  return res
    .status(200)
    .json(
      new ApiRespose(200, similarProduct, "similar product fetched successfull")
    );
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  const products = await Product.find({ category }).populate("category");
  return res
    .status(200)
    .json(new ApiRespose(200, products, "Get product by category"));
});

export {
  createProduct,
  updateProduct,
  getAllProduct,
  deleteProduct,
  filterProduct,
  countProduct,
  listProduct,
  searchProduct,
  getSingleProduct,
  getSimilarProduct,
  getProductByCategory,
};
