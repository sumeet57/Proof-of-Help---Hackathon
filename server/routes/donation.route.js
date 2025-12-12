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

  authenticate,
  createDonationController
);
donationRouter.get(
  "/my",

  authenticate,
  listMyDonationsController
);
donationRouter.post(
  `/validate/:requestId`,

  authenticate,
  validateBeforeDonation
);

export default donationRouter;
