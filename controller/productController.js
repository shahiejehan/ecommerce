import fs from "fs";
import productModel from "../model/productModel.js";
import categoryModel from "../model/categoryModel.js";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../model/orderModel.js";

dotenv.config();

//Braintree payment Gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//controller for adding product
export const createProductController = async (req, res) => {
  try {
    // console.log(req.fields)
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    // console.log(Category)
    // console.log(req.files)
    const { photo } = req.files;

    //validation using switch case
    switch (true) {
      case !name:
        return res.status(404).send({ message: "name is required" });
      case !description:
        return res.status(404).send({ message: "Description is required" });
      case !price:
        return res.status(404).send({ message: "Price is required" });
      case !category:
        return res.status(404).send({ message: "Category is required" });
      case !quantity:
        return res.status(404).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(404)
          .send({ message: "Photo is required and should be less than 1MB" });
    }
    //adding new product
    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    // console.log(product)
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "New product Added successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while adding product",
      error,
    });
  }
};

//controller for getting all products
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "showing all products",
      products,
      total_products: products.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting products",
      error,
    });
  }
};

//controller for getting single product
export const getSingleProductController = async (req, res) => {
  try {
    // const { _id } = req.params
    // console.log(_id)

    // console.log(req.params);

    const product = await productModel
      .findById({ _id: req.params._id })
      .populate("category");
    // console.log(product)
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not avaliable",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "product showing is here",
        product,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting product",
      error,
    });
  }
};

//controller for product photo
export const productPhotoController = async (req, res) => {
  try {
    // console.log(req.params._id)
    const product = await productModel.findById(req.params._id).select("photo");
    //   console.log(product)
    if (product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting photo",
      error,
    });
  }
};

//controller for deleting product
export const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.params;
    // console.log(req.params)
    const product = await productModel.findByIdAndDelete(_id);
    //    console.log(product)
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while deleting products",
      error,
    });
  }
};

//controller for updating product
export const updateProductController = async (req, res) => {
  try {
    // const  { id } = req.params;
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    // console.log(_id)
    // console.log(req.files)
    // console.log(req.fields)
    const { photo } = req.files;

    //validation using switch case
    // switch (true) {
    //     case !name:
    //         return res.status(404).send({ message: "name is required" })
    //     case !description:
    //         return res.status(404).send({ message: "Description is required" })
    //     case !price:
    //         return res.status(404).send({ message: "Price is required" })
    //     case !category:
    //         return res.status(404).send({ message: "Category is required" })
    //     case !quantity:
    //         return res.status(404).send({ message: "Quantity is required" })
    //     case photo
    //      && photo.size > 1000000:
    //          return res.status(404).send({ message: "Photo is required and should be less than 1MB" })
    // }
    // console.log(req.params.id)
    const product = await productModel.findByIdAndUpdate(
      req.params._id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    // console.log(product);
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    // console.log(photo)
    await product.save();

    // console.log(product)
    res.status(201).send({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while updating product",
      error,
    });
  }
};

//controller for filter products
export const productControllerFilter = async (req, res) => {
  // res.send("filter working");

  try {
    const { check, radio } = req.body;

    let args = {};
    if (check.length > 0) args.category = check;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "showing products wait...",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while filtering products",
      error,
    });
  }
};

//controller for product count (pagination )
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "product are",
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while counting products",
      error,
    });
  }
};

// controller for product per page (pagination)
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while  product per page",
      error,
    });
  }
};

//controller for search product ==========
export const searchProductController = async (req, res) => {
  try {
    const { keyboard } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyboard, $options: "i" } },
          { description: { $regex: keyboard, $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "List of products searched...",
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while searching product",
      error,
    });
  }
};

//controller for similar product ===============
export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(5)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting similar products",
      error,
    });
  }
};

//product wise category controller
export const productWiseCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      messsage: "something went wrong while getting product wise category",
      error,
    });
  }
};

//braintree payment Controller=//////////////////////////=//////////////////////=/////////////////=/////////////////
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart?.map((i) => {
      total += i.price;
    });
    console.log(cart);
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });
          await order.save();
          // console.log(order);
          // console.log(res.json({ ok: true }));
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
