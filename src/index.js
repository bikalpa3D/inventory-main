import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {  server } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8100, () => {
      console.log(`Server running on port ${process.env.PORT || 8100}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });
