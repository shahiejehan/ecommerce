import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";

// middeleware for signinrequired(Protected middelware)
export const requireSignIn = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while sign in (middleware)",
      error,
    });
  }
};

// middleware for checking user role or admin role
export const isAdmin = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    const user = await userModel.findById(req.user.id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorised Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in Admin middleware",
      error,
    });
    console.log(error);
  }
};
