import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log("Connected to DB:", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
}

export default connectDB;
