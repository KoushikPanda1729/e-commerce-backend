import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
  },
  singleProductPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  await this.populate("items.product");

  // Calculate the total price

  this.totalPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
