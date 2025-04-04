import mongoose, { Schema } from "mongoose";
const OrderItemSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
