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

userRouter.get("/", authenticate, getUserProfile);
userRouter.post("/login", validateLogin, loginUser);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/logout", authenticate, logoutUser);
userRouter.post(
  "/wallet",

  authenticate,
  setWalletController
);
userRouter.put("/", authenticate, updateUserProfile);
userRouter.get("/:userId", authenticate, publicProfileController);

export default userRouter;
