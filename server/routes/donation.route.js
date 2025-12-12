import { Router } from "express";
import {
  createDonationController,
  listMyDonationsController,
  validateBeforeDonation,
} from "../controllers/donation.controller.js";
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
donationRouter.get(
  "/my",
  sessionAuthentication,
  authenticate,
  listMyDonationsController
);
donationRouter.post(
  `/validate/:requestId`,
  sessionAuthentication,
  authenticate,
  validateBeforeDonation
);

export default donationRouter;
