import User from "../models/user.model.js";

export async function findUserByEmailWithPassword(email) {
  return User.findOne({ email }).select("+password");
}

export async function findUserById(userId) {
  return User.findById(userId);
}

export async function updateWalletId(userId, walletId) {
  const user = await User.findByIdAndUpdate(
    userId,
    { walletId },
    { new: true }
  ).select("-password");
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
