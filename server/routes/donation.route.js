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
donationRouter.get(
  "/request/:requestId",
  sessionAuthentication,
  authenticate,
  listDonationsForRequestController
);
donationRouter.post(
  `/validate/:requestId`,
  sessionAuthentication,
  authenticate,
  validateBeforeDonation
);

export default donationRouter;
