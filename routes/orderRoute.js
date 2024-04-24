import express from "express";

import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  getAllOrdersController,
  getOrdersController,
  orderStatusController,
} from "../controller/authController.js";

const router = express.Router();

// orders routes after payment through Braintree
//user route
router.get("/order", requireSignIn, getOrdersController);

//admin route
router.get("/all-orders", requireSignIn, getAllOrdersController);

//updating status
router.put("/order-status/:orderId", requireSignIn, orderStatusController);

export default router;
