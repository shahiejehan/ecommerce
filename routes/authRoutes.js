import express from "express";
import {
  forgotPasswordController,
  loginController,
  registrationController,
  searchUserController,
  testController,
  updateUserProfileController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

//register routing & authentication routing
router.post("/register", registrationController);

// login routing
router.post("/login", loginController);

//forget password=======================
router.post("/forgot-password", forgotPasswordController);

// protected route=================================
router.get("/tests", requireSignIn, testController);

//user rote
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//admin router
router.get("/admin-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//update profile user

router.put("/profile/:_id", updateUserProfileController);
router.get("/searchUser", searchUserController);

export default router;
