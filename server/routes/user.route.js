import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  publicProfileController,
  registerUser,
  setWalletController,
  updateUserProfile,
} from "../controllers/user.controller.js";
import {
  authenticate,
  sessionAuthentication,
} from "../middlewares/authenticate.js";
import { validateLogin, validateRegister } from "../middlewares/validate.js";

const userRouter = express.Router();

userRouter.get("/", sessionAuthentication, authenticate, getUserProfile);
userRouter.post("/login", validateLogin, loginUser);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/logout", sessionAuthentication, authenticate, logoutUser);
userRouter.post(
  "/wallet",
  sessionAuthentication,
  authenticate,
  setWalletController
);
userRouter.put("/", sessionAuthentication, authenticate, updateUserProfile);
userRouter.get(
  "/:userId",
  sessionAuthentication,
  authenticate,
  publicProfileController
);
export default userRouter;
