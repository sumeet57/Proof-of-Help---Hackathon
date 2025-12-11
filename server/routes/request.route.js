import express from "express";
import {
  authenticate,
  sessionAuthentication,
} from "../middlewares/authenticate.js";
import {
  listRequestsController,
  createRequestController,
  getRequestController,
} from "../controllers/request.controller.js";
import { validateRequestCreation } from "../middlewares/validate.js";

const requestRouter = express.Router();

requestRouter.get(
  "/",
  sessionAuthentication,
  authenticate,
  listRequestsController
);
requestRouter.get(
  "/:requestId",
  sessionAuthentication,
  authenticate,
  getRequestController
);
requestRouter.post(
  "/",
  sessionAuthentication,
  authenticate,
  validateRequestCreation,
  createRequestController
);

export default requestRouter;
