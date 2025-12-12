import express from "express";
import {
  authenticate,
  sessionAuthentication,
} from "../middlewares/authenticate.js";
import {
  listRequestsController,
  createRequestController,
  getRequestController,
  listMyRequestsController,
  updateRequestStatusController,
} from "../controllers/request.controller.js";
import { validateRequestCreation } from "../middlewares/validate.js";

const requestRouter = express.Router();

requestRouter.get(
  "/",

  authenticate,
  listRequestsController
);
requestRouter.get(
  "/:requestId",

  authenticate,
  getRequestController
);
requestRouter.post(
  "/",

  authenticate,
  validateRequestCreation,
  createRequestController
);

requestRouter.get(
  "/user/:userId",

  authenticate,
  listMyRequestsController
);
requestRouter.patch(
  "/:requestId",

  authenticate,
  updateRequestStatusController
);

export default requestRouter;
