import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Category } from "../models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Please provide Name of category");
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({ name });

  res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Please provide Name of category");
  }

  const existingCategory = await Category.findById(categoryId);

  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        name,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const existingCategory = await Category.findById(categoryId);

  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  const category = await Category.findByIdAndDelete(categoryId);

  res
    .status(200)
    .json(new ApiResponse(200, category, "Category deleted successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
