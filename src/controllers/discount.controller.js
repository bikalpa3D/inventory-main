import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Discount } from "../models/discount.models.js";

const createDiscount = asyncHandler(async (req, res) => {
  const { name, percentage } = req.body;

  if (!name || !percentage) {
    throw new ApiError(400, "Please provide name and percentage of discount");
  }

  const existingDiscount = await Discount.findOne({ name });

  if (existingDiscount) {
    throw new ApiError(400, "Discount already exists");
  }

  const discount = await Discount.create({
    name,
    percentage,
  });

  res
    .status(201)
    .json(new ApiResponse(201, discount, "Discount created successfully"));
});

const updateDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;
  const { name, percentage } = req.body;

  if (!name || !percentage) {
    throw new ApiError(400, "Please provide name and percentage of discount");
  }

  const existingDiscount = await Discount.findById(discountId);

  if (!existingDiscount) {
    throw new ApiError(404, "Discount not found");
  }

  const discount = await Discount.findByIdAndUpdate(
    discountId,
    {
      $set: {
        name,
        percentage,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, discount, "Discount updated successfully"));
});

const deleteDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  if (!discountId) {
    throw new ApiError(400, "Please provide discount id");
  }

  const existingDiscount = await Discount.findById(discountId);

  if (!existingDiscount) {
    throw new ApiError(404, "Discount not found");
  }

  const deletedDiscount = await Discount.findByIdAndDelete(discountId);

  res
    .status(200)
    .json(
      new ApiResponse(200, deletedDiscount, "Discount deleted successfully")
    );
});

const getAllDiscounts = asyncHandler(async (req, res) => {
  const discounts = await Discount.find({});

  res
    .status(200)
    .json(
      new ApiResponse(200, discounts, "All discounts fetched successfully")
    );
});

const getDiscountById = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  if (!discountId) {
    throw new ApiError(400, "Please provide discount id");
  }

  const discount = await Discount.findById(discountId);

  if (!discount) {
    throw new ApiError(404, "Discount not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, discount, "Discount by Id fetched successfully")
    );
});

export {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
  getDiscountById,
};
