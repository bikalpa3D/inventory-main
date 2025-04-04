import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock } = req.body;
  const imagepath = req.file.path;
  console.log(imagepath);

  if (!name || !category || !price || !stock) {
    throw new ApiError(400, "Please provide all fields");
  }

  const existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    throw new ApiError(400, "Product already exists");
  }

  const cloudImage = await uploadOnCloudinary(imagepath);

  if (!cloudImage || !cloudImage.url) {
    throw new ApiError(500, "Image upload failed");
  }

  const product = await Product.create({
    name,
    category: new mongoose.Types.ObjectId(category),
    price,
    stock,
    image: cloudImage.url,
  });

  res.status(201).json(new ApiResponse(201, product, "Product created"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock } = req.body;
  const { productId } = req.params;

  const imagepath = req.file.path;

  if (!name || !category || !price || !stock) {
    throw new ApiError(400, "Please provide all fields");
  }

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const cloudImage = await uploadOnCloudinary(imagepath);

  if (!cloudImage || !cloudImage.url) {
    throw new ApiError(500, "Image upload failed");
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        name,
        category: new mongoose.Types.ObjectId(category),
        price,
        stock,
        image: cloudImage?.url,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, product, "Product updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  await Product.findByIdAndDelete(productId);

  res.status(200).json(new ApiResponse(200, {}, "Product deleted"));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        name: 1,
        price: 1,
        stock: 1,
        image: 1,
        "category.name": 1,
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, products, "Products fetched"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        name: 1,
        price: 1,
        stock: 1,
        image: 1,
        "category.name": 1,
      },
    },
  ]);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product fetched"));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const products = await Product.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        name: 1,
        price: 1,
        stock: 1,
        image: 1,
        "category.name": 1,
      },
    },
  ]);
});
export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  getProductByCategory,
};
