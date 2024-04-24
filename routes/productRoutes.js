import express from "express";
import ExpressFormidable from "express-formidable";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  productControllerFilter,
  productCountController,
  productListController,
  productPhotoController,
  productWiseCategoryController,
  searchProductController,
  similarProductController,
  updateProductController,
} from "../controller/productController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

// import { requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

//===========add product route======
router.post("/add-product", ExpressFormidable(), createProductController);
//==========get all products route===============
router.get("/all-products", ExpressFormidable(), getAllProductController);
//===========get single product route=============
router.get(
  "/single-product/:_id",
  ExpressFormidable(),
  getSingleProductController
);

//===========product photo route================
router.get("/product-photo/:_id", ExpressFormidable(), productPhotoController);
//path :-http://localhost:4300/app/v1/product/product-photo

//===========delete product route=============
router.delete(
  "/delete-product/:_id",
  ExpressFormidable(),
  deleteProductController
);
//path :-http://localhost:4300/app/v1/product/delete-product/

//=============update product route================
router.put(
  "/update-product/:_id",
  ExpressFormidable(),
  updateProductController
);

//=============filter Products Api =================
router.post("/filter-product", productControllerFilter);
//path:- http://localhost:4300/app/v1/product/filter-product

//======================================pagination routes below==================================================

//===============product Count controller===========
router.get("/product-count", productCountController);
//path:- http://localhost:4300/app/v1/product/product-count

//=============product list contrtoller==========
router.get("/product-list/:page", productListController);
//path:- http://localhost:4300/app/v1/product/product-list

//==============router for search product==============
router.get("/search-product/:keyboard", searchProductController);
// path:- http://localhost:4300/app/v1/product/search-product

// similar product  route==================================
router.get("/related-product/:pid/:cid", similarProductController);

//categorywise controller
router.get("/productwise-category/:slug", productWiseCategoryController);

//braintree Payments Routes
//braintree token
router.get("/braintree/token", braintreeTokenController);
//payment
router.post("/barintree/payment", requireSignIn, braintreePaymentController);

export default router;
