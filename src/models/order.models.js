import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    total: { type: Number, required: true, min: 0 }, // Total before discount
    discountedTotal: { type: Number, required: true, min: 0 }, // Final total after discount
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discount: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
      default: null,
    },
    paymentType: { type: String, enum: ["CASH", "KHALTI"], required: true },
    paymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    isPaid: { type: Boolean, default: false },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
