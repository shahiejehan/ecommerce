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

const server = express();

//dotenv configuration
dotenv.config();
// port no.
const PORT = process.env.PORT;

// connect db
connDB();
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

server.use("*", function (re, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

//Base Url:- http://localhost:4300/app/v1/
//End points  like:- /register , /login , /forgot-password ,/create-category ,/delete-category ,/update-category

server.listen(PORT, () => {
  console.log(
    `express server is running on: http://localhost:${PORT};`.bgRed.white
  );
  console.log(
    `express server is running on: http://localhost:${PORT};`.america
  );
});
