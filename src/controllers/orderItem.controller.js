import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { OrderItem } from "../models/orderItem.models.js";
import { Product } from "../models/product.models.js";
import { socketConnection } from "../app.js";
import { SocketServerConnection } from "../utils/socketConnection.js";
import { Order } from "../models/order.models.js";
import { khaltiPaymentVerify } from "../utils/khaltiPaymentVerify.js";

const addToOrderItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity > product.stock) {
    SocketServerConnection.sendMessageViaSocket(req.user._id, 0);
    throw new ApiError(400, "Quantity exceeds stock");
  }
  const existingOrderItems = await OrderItem.findOne({
    owner: req.user._id,
    product: productId,
  });

  let orderItem;

  if (!existingOrderItems) {
    orderItem = await OrderItem.create({
      owner: req.user._id,
      product: productId,
      quantity: quantity,
      price: product.price * quantity,
    });
  } else {
    const newQuantity = existingOrderItems.quantity + quantity;
    const newPrice = product.price * newQuantity;

    if (newQuantity > product.stock) {
      throw new ApiError(400, "Quantity exceeds stock");
    }

    existingOrderItems.quantity = newQuantity;
    existingOrderItems.price = newPrice;
    orderItem = await existingOrderItems.save();
  }

  await orderItem.populate("product");

  res
    .status(201)
    .json(new ApiResponse(201, orderItem, "Order item added successfully"));
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { orderItemId } = req.params;
  const { quantity } = req.body;

  const orderItem = await OrderItem.findById(orderItemId);

  if (!orderItem) {
    throw new ApiError(404, "Order item not found");
  }

  const product = await Product.findById(orderItem.product);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity > product.stock) {
    throw new ApiError(400, "Quantity exceeds stock");
  }

  orderItem.quantity = quantity;
  orderItem.price = product.price * quantity;

  await orderItem.save();

  await orderItem.populate("product");

  res
    .status(200)
    .json(new ApiResponse(200, orderItem, "Order item updated successfully"));
});

const deleteOrderItem = asyncHandler(async (req, res) => {
  const { orderItemId } = req.params;

  const orderItem = await OrderItem.findById(orderItemId);

  if (!orderItem) {
    throw new ApiError(404, "Order item not found");
  }

  await orderItem.remove();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Order item deleted successfully"));
});

const getAllOrderItems = asyncHandler(async (req, res) => {
  const orderItems = await OrderItem.find({ owner: req.user._id }).populate(
    "product"
  );

  res
    .status(200)
    .json(new ApiResponse(200, orderItems, "Order items fetched successfully"));
});

export { addToOrderItem, updateQuantity, deleteOrderItem, getAllOrderItems };

export const payViaKhalti = asyncHandler(async (req, resp) => {
  const { orderId } = req.body;
  const user = req.user;

  if (!orderId) {
    throw new ApiError("please provide orderId");
  }

  const orderedProduct = await Order.findOne({ _id: orderId }).populate(
    "orderItems"
  );

  if (!orderedProduct) {
    throw new ApiError("order not found");
  }

  const calculateTotalPrice = orderedProduct.orderItems.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  const resp = await fetch(process.env.KHALTI_END_POINT, {
    method: "POST",
    headers: {
      Authorization: "Key 0c05e393ff924ec2827d3fbe33f013ad",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: process.env.KHALTI_CALLBACK_URL,
      website_url: process.env.BACKEND_ORIGIN,
      amount: calculateTotalPrice * 10,
      purchase_order_id: orderedProduct._id,
      purchase_order_name: user.username,
      customer_info: {
        name: user.username,
        email: user.email,
      },
    }),
  });
  const data = await resp.json();
  resp.status(200).json(new ApiResponse(200, data, "success"));
});

export const khaltiCallback = asyncHandler(async (req, resp) => {
  const data = req.query;
  const { _id } = req.user;
  console.log(data);

  const verify = await khaltiPaymentVerify(data.pidx);

  if (verify.status != "Completed") {
    throw new ApiError("failed to verify your payment");
  }

  const productOrder = await Order.findByIdAndUpdate(
    data.purchase_order_id,
    {
      $set: {
        status: "CONFIRMED",
        isPaid: true,
      },
    },
    {
      new: true,
    }
  );
  if (!productOrder) {
    throw new ApiError("there is no any orders");
  }

  productOrder.orderItems.forEach(async (item) => {
    const product = await Product.findById(item.product._id);
    product.stock -= item.quantity;
    await product.save();
    SocketServerConnection.sendMessageViaSocket(
      _id,
      product.stock,
      "remainingStock"
    );
  });

  SocketServerConnection.sendMessageViaSocket(
    _id,
    "Your order has been confirmed",
    "orderConfirmed"
  );

  resp.status(200).json(new ApiResponse("", 200, null));
});
