import { comparePassword, hashPassword } from "../utils/auth/password.utils.js";
import User from "../models/user.model.js";
import {
  accessTokenOptions,
  generateToken,
  refreshTokenOptions,
} from "../utils/auth/token.utils.js";
import {
  createSessionForUser,
  login,
  register,
} from "../services/auth.service.js";
import crypto from "crypto";
import { hashSessionId } from "../utils/auth/session.utils.js";
import { updateWalletId } from "../services/user.service.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const data = await register({ fullName, email, password });
    const tokens = generateToken(data.user._id);

    return res
      .status(201)
      .cookie("accessToken", tokens.accessToken, accessTokenOptions)
      .cookie("refreshToken", tokens.refreshToken, refreshTokenOptions)
      .json({
        message: "User registered successfully",
        user: data.user,
        sessionId: data.sessionId,
      });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await login({ email, password });

    const tokens = generateToken(data.user._id);

    return res
      .status(200)
      .cookie("accessToken", tokens.accessToken, accessTokenOptions)
      .cookie("refreshToken", tokens.refreshToken, refreshTokenOptions)
      .json({
        message: "Login successful",
        user: data.user,
        sessionId: data.sessionId,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, walletId } = req.body;
    const update = {};
    if (fullName) update.fullName = fullName;
    if (walletId !== undefined) update.walletId = walletId;
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", accessTokenOptions);
    res.clearCookie("refreshToken", refreshTokenOptions);

    const sessionId = req.headers["x-session-id"];
    const userId = req.userId;

    if (sessionId && userId) {
      const hashedSessionId = hashSessionId(sessionId);
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            sessions: { sessionIdHash: hashedSessionId },
          },
        }
      );
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const setWalletController = async (req, res) => {
  try {
    const userId = req.userId;

    const { walletId } = req.body;

    const updated = await updateWalletId(userId, walletId ?? null);

    return res.json({
      success: true,
      user: updated,
    });
  } catch (err) {
    console.error("setWalletController error:", err);
    if (err.code === "INVALID_WALLET") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const publicProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
