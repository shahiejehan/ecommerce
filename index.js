import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connDB from "./config/connectdb.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const server = express();
const apiBaseUrl = "https://shahishemu.cyclic.app";
// const apiBaseUrl = 'http://localhost';

//dotenv configuration
dotenv.config();
// port no.
const PORT = process.env.PORT;

// connect db
connDB();
// esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//MiddleWares:
//routing
server.use(express.json());
server.use(cors());
server.use(express.static(path.join(__dirname, "./frontend/build")));

//auth routes
server.use("/app/v1/", authRoutes);
//category routes
server.use("/app/v1/", categoryRoutes);
//product routes
server.use("/app/v1/product/", productRoutes);
server.use("/app/v1/", orderRoute);

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

//Base Url:- http://localhost:4300/app/v1/
//End points  like:- /register , /lompgin , /forgot-password ,/create-category ,/delete-category ,/update-category

server.listen(PORT, () => {
  console.log(
    `express server is running on: ${apiBaseUrl}:${PORT};`.bgRed.white
  );
  console.log(`express server is running on: ${apiBaseUrl}:${PORT};`.america);
});
