import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timeseries: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
