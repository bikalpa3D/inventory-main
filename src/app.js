import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { SocketServerConnection } from "./utils/socketConnection.js";

const app = express();
export const server = http.createServer(app);
const socketServer = new Server(server);
export const socketConnection = new SocketServerConnection(socketServer);

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import discountRouter from "./routes/discount.routes.js";
import productRouter from "./routes/product.routes.js";
import orderItemRouter from "./routes/orderItem.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/discounts", discountRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orderItems", orderItemRouter);

export { app };
