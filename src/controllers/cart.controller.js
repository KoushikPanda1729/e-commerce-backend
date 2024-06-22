import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiRespose from "../utils/apiResponse.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { slug } = req.params;

  const product = await Product.findOne({ slug });

  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  let cart = await Cart.findOne({ owner: userId });

  if (cart) {
    // Check if the product is already in the cart
    const cartItemIndex = cart.items.findIndex((item) =>
      item.product.equals(product._id)
    );

    if (!(cartItemIndex > -1)) {
      // Add new product to the cart
      cart.items.push({
        product: product._id,
        quantity: 1,
        name: product.productName,
        singleProductPrice: product.price,
      });
    } else {
      throw new ApiError(400, "Product already exists in the cart");
    }
  } else {
    // Create a new cart for the user
    cart = await Cart.create({
      owner: userId,
      items: [
        {
          product: product._id,
          quantity: 1,
          name: product.productName,
          singleProductPrice: product.price,
        },
      ],
    });
  }

  // Save the cart
  await cart.save();
  return res
    .status(200)
    .json(new ApiRespose(200, cart, "Cart added successfully"));
});

const deleteToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req?.user?._id;
  const cart = await Cart.findOne({ owner: userId });

  if (!cart) {
    throw new ApiError(400, "cart does not exists");
  }

  cart.items = cart.items.filter((item) => !item.product.equals(productId));
  await cart.save();
  return res
    .status(200)
    .json(new ApiRespose(200, cart, "Cart delete successfully"));
});

const increaseQYT = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { quantity } = req.body;
  const { productId } = req.params; //6672e68b48fc4e2ceb3dc1ea

  let cart = await Cart.findOne({ owner: userId });
  const product = await Product.findById(productId);

  const cartIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  cart.items[cartIndex].quantity += quantity;
  cart.items[cartIndex].singleProductPrice =
    product.price * cart.items[cartIndex].quantity;
  cart.save();

  return res.status(200).json(new ApiRespose(200, cart, "Increase quantity"));
});

const decreaseQYT = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { quantity } = req.body;
  const { productId } = req.params;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ owner: userId });

  const cartIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  cart.items[cartIndex].quantity -= quantity;
  if (cart.items[cartIndex].quantity < 1) {
    throw new ApiError(400, "Need atleast one product");
  }
  console.log(cart.items[cartIndex]);
  cart.items[cartIndex].singleProductPrice =
    product.price * cart.items[cartIndex].quantity;
  cart.save();
  return res.status(200).json(new ApiRespose(200, cart, "decrease quantity"));
});

const getAllCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ owner: req.user._id });

  return res.status(200).json(new ApiRespose(200, cart[0].items, "All cart fetched"));
});

export { addToCart, deleteToCart, increaseQYT, decreaseQYT, getAllCart };
