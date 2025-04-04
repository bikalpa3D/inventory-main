import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { OrderItem } from "../models/orderItem.models.js";
import { Product } from "../models/product.models.js";

const addToOrderItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity > product.stock) {
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
