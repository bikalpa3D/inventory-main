import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
