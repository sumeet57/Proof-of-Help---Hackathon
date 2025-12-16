import User from "../models/user.model.js";
import { normalizeWalletAddress } from "../utils/wallet.utils.js";

export async function findUserByEmailWithPassword(email) {
  return User.findOne({ email }).select("+password");
}
export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function findUserById(userId) {
  return User.findById(userId);
}
export async function findUserByIdWithPassword(userId) {
  return User.findById(userId).select("+password");
}

export async function getUserWalletId(userId) {
  const user = await User.findById(userId).select("walletId");
  return user ? user.walletId : null;
}

export async function updateWalletId(userId, walletId) {
  const normalized = walletId ? normalizeWalletAddress(walletId) : null;

  if (normalized && !/^0x[0-9a-f]{40}$/.test(normalized)) {
    const err = new Error("Invalid wallet address");
    err.code = "INVALID_WALLET";
    throw err;
  }

  const update = {
    walletId: normalized,
  };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  );

  if (!user) {
    console.error("User not found for ID:", userId);
    const err = new Error("User not found");
    err.code = "USER_NOT_FOUND";
    throw err;
  }
  return user;
}

export async function addBoastCredits(userId, count) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { boasts: count } },
    { new: true }
  ).select("-password");

  return user;
}

export async function consumeRequestCreditOrThrow(userId) {
  const user = await User.findOne({ _id: userId }).select("requests");
  if (!user) throw new Error("User not found");

  if (user.requests <= 0) {
    const err = new Error("Not enough request credits");
    err.code = "NO_REQUEST_CREDITS";
    throw err;
  }

  user.requests -= 1;
  await user.save();
  return user.requests;
}

export async function consumeBoastCreditOrThrow(userId) {
  const user = await User.findOne({ _id: userId }).select("boasts");
  if (!user) throw new Error("User not found");

  if (user.boasts <= 0) {
    const err = new Error("Not enough boast credits");
    err.code = "NO_BOAST_CREDITS";
    throw err;
  }

  user.boasts -= 1;
  await user.save();
  return user.boasts;
}
