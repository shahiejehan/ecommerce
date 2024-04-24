import userModel from "../model/userModel.js";
import orderModel from "../model/orderModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const registrationController = async (req, res) => {
  try {
    //destructure to store the data from the body
    const { name, email, password, phone, address, answer } = req.body;

    //validation
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password)
      return res.status(400).json({ error: "Password is required" });
    if (!phone) return res.status(400).json({ error: "phone no. is required" });
    if (!address) return res.status(400).json({ error: "Address is required" });
    if (!answer) return res.status(400).json({ error: "Answer is required" });

    //existing user===============================
    const exixtingUser = await userModel.findOne({ email });
    if (exixtingUser) {
      res.status(200).send({
        success: true,
        message: "user already registered . click to Login",
        exixtingUser,
      });
    }
    //new user======================================
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name: name,
      email: email,
      password: hashPassword,
      phone: phone,
      address: address,
      answer: answer,
    });
    await user.save();
    res.status(201).send({
      success: true,
      message: "user registered successfully.",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while registering new user",
      error,
    });
    console.log("error");
  }
};

export const loginController = async (req, res) => {
  // res.send("post login api is working!")
  try {
    //destructure==================================
    const { email, password } = req.body;

    //validation check=============================
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "please fill the fields",
      });
    }

    //check user====================================
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not registered please register first",
        user,
      });
    }
    //check password or compare =======================
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).send({
        success: false,
        message: "invalid password",
      });
    }
    // token generation====================================
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      mesage: "error while login...",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    //validation
    if (!email) {
      return res.status(500).send({ message: "email is required" });
    }
    if (!answer) {
      return res.status(500).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      return res.status(500).send({ message: "New password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong email or answer",
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(201).send({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in forgot password",
      error,
    });
  }
};

//update user profile Controller===================================
export const updateUserProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const user = await userModel.findById(req.params._id);

    if (!password || password.length < 6) {
      return res.send({
        message: "password required and must be 6 characters long",
      });
    }

    const hashPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(req.params._id, {
      name: name || user.name,
      password: hashPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address,
    });
    res.status(201).send({
      success: true,
      messgae: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while updating user profile",
      error,
    });
  }
};

// test api for checking protected routes

export const testController = async (req, res) => {
  try {
    res.send("protected route is working when auth provided");
  } catch (error) {
    console.log(error);
  }
};

export const searchUserController = async (req, res) => {
  // res.send("search user api is working...")
  res.render("home", { title: "homepage", name: "Aptron", city: "noida" });
};

// get orders api
export const getOrdersController = async (req, res) => {
  try {
    // console.log({buyer :req.user.id});
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting ordered product details!",
      error,
    });
  }
};

//Admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("buyer", "name")
      .populate("products", "-photo")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while getting ordered product details!",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = await orderModel.findByIdAndUpdate(orderId, {
      status: status,
    });
    res.status(200).send({
      success: true,
      message: "order status changed successfully",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong while changing order Status!",
      error,
    });
  }
};
