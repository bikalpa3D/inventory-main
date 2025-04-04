import mongoose from "mongoose";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log("Connected to DB:", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
}

export default connectDB;
