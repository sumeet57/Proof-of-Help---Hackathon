import express from "express";
import {
  authenticate,
  sessionAuthentication,
} from "../middlewares/authenticate.js";
import { listRequestsController } from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter.get(
  "/",
  sessionAuthentication,
  authenticate,
  listRequestsController
);

export default requestRouter;
