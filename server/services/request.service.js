import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import { consumeRequestCreditOrThrow } from "./user.service.js";

export async function createRequestForUser(userId, payload) {
  const { title, description, category, target } = payload;

  await consumeRequestCreditOrThrow(userId);

  const request = await Request.create({
    user: userId,
    title,
    description,
    category: category || "other",
    target: target || {},
  });

  return request;
}

export async function getRequestById(requestId) {
  return Request.findById(requestId).populate(
    "user",
    "fullName email walletId"
  );
}

export async function listRequests(filters = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  const skip = (Number(page) - 1) * Number(limit);

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [items, total] = await Promise.all([
    Request.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "fullName email walletId"),
    Request.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)) || 1,
  };
}

export async function listRequestsForUser(userId) {
  const response = await Request.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "fullName email walletId");
  return {
    items: response,
  };
}

export async function updateRequestStatus(requestId, userId, newStatus) {
  const allowed = ["open", "closed", "flagged"];
  if (!allowed.includes(newStatus)) {
    const err = new Error("Invalid status");
    err.code = "INVALID_STATUS";
    throw err;
  }

  const request = await Request.findById(requestId);
  if (!request) {
    const err = new Error("Request not found");
    err.code = "NOT_FOUND";
    throw err;
  }

  if (request.user.toString() !== userId.toString()) {
    const err = new Error("Not authorized to update this request");
    err.code = "FORBIDDEN";
    throw err;
  }

  request.status = newStatus;
  await request.save();
  return request;
}

export async function updateRequestTotalsAfterDonation(requestId, amountValue) {
  const now = new Date();
  const request = await Request.findById(requestId).select(
    "totals target status"
  );
  if (!request) return null;

  request.totals.totalReceived += amountValue;
  request.totals.donorsCount += 1;
  request.totals.lastDonationAt = now;

  if (
    request.target &&
    request.target.amount > 0 &&
    request.totals.totalReceived >= request.target.amount &&
    request.status === "open"
  ) {
    request.status = "closed";
  }

  await request.save();
  return request;
}
