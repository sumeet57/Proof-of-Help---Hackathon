import Donation from "../models/donation.model.js";
import Request from "../models/request.model.js";
import { updateRequestTotalsAfterDonation } from "./request.service.js";

export async function createDonationRecord(payload) {
  const {
    requestId,
    fromUserId,
    toUserId,
    fromWallet,
    toWallet,
    amountValue,
    currencySymbol,
    networkName,
    expectedChainId,
    txHash,
    blockNumber,
    txTimestamp,
    meta,
  } = payload;

  const request = await Request.findById(requestId);
  if (!request) {
    const err = new Error("Request not found");
    err.code = "REQUEST_NOT_FOUND";
    throw err;
  }

  if (request.status !== "open") {
    const err = new Error("Request is not open for donations");
    err.code = "REQUEST_NOT_OPEN";
    throw err;
  }

  if (toUserId && request.user.toString() !== toUserId.toString()) {
    const err = new Error("Target user does not own this request");
    err.code = "INVALID_TARGET_USER";
    throw err;
  }

  const donation = await Donation.create({
    request: requestId,
    fromUser: fromUserId,
    toUser: toUserId || request.user,
    fromWallet,
    toWallet,
    amount: {
      value: amountValue,
      currencySymbol,
      networkName,
      expectedChainId,
    },
    txHash,
    blockNumber,
    txTimestamp: txTimestamp ? new Date(txTimestamp) : undefined,
    meta: meta || {},
  });

  await updateRequestTotalsAfterDonation(requestId, amountValue);

  return donation;
}

export async function getDonationById(donationId) {
  return Donation.findById(donationId)
    .populate("fromUser", "fullName email walletId")
    .populate("toUser", "fullName email walletId")
    .populate("request", "title");
}

export async function listDonations(filters = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    requestId,
    fromUserId,
    toUserId,
    fromWallet,
    toWallet,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const query = {};

  if (requestId) query.request = requestId;
  if (fromUserId) query.fromUser = fromUserId;
  if (toUserId) query.toUser = toUserId;
  if (fromWallet) query.fromWallet = fromWallet.toLowerCase();
  if (toWallet) query.toWallet = toWallet.toLowerCase();

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [items, total] = await Promise.all([
    Donation.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("fromUser", "fullName email walletId")
      .populate("toUser", "fullName email walletId")
      .populate("request", "title"),
    Donation.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)) || 1,
  };
}

export async function listDonationsForRequest(requestId, options = {}) {
  return listDonations({}, { ...options, requestId });
}

export async function listDonationsForUser(userId, options = {}) {
  return listDonations(
    {},
    {
      ...options,
    }
  );
}

export const listMyDonations = async (userId, options = {}) => {
  return listDonationsForUser(userId, options);
};
