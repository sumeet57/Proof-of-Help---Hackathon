import { Router } from "express";
import {
  checkout,
  verifyPayment,
  cashfreeWebhook,
  userDroppedController,
} from "../controllers/payment.controller.js";

import { cashfreeSignatureVerifier } from "../middlewares/payment.js";
import { authenticate } from "../middlewares/authenticate.js";
const paymentRoute = Router();

paymentRoute.post("/checkout", authenticate, checkout);
paymentRoute.post("/verify", authenticate, verifyPayment);
paymentRoute.post("/webhook", cashfreeSignatureVerifier, cashfreeWebhook);
paymentRoute.post("/user-dropped", authenticate, userDroppedController);

export default paymentRoute;
