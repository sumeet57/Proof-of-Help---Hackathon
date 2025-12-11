import { Router } from "express";
import { createDonationController } from "../controllers/donation.controller.js";
import {
  authenticate,
  sessionAuthentication,
} from "../middlewares/authenticate.js";

const donationRouter = Router();

donationRouter.post(
  "/",
  sessionAuthentication,
  authenticate,
  createDonationController
);

export default donationRouter;
