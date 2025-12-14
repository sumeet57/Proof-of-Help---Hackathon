import { Router } from "express";
import {
  createDonationController,
  listDonationsForRequestController,
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
donationRouter.get(
  "/request/:requestId",
  authenticate,
  listDonationsForRequestController
);
donationRouter.post(
  `/validate/:requestId`,

  authenticate,
  validateBeforeDonation
);

export default donationRouter;
