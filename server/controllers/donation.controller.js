import {
  createDonationRecord,
  getDonationById,
  listDonations,
  listDonationsForRequest,
  listMyDonations,
} from "../services/donation.service.js";
import { getRequestById } from "../services/request.service.js";
import { getUserWalletId } from "../services/user.service.js";

export async function createDonationController(req, res) {
  try {
    const {
      request: requestId,
      toUser: toUserId,
      fromWallet,
      toWallet,
      amount = {}, // ⬅️ FIX: Provide default empty object for safe destructuring
      txHash,
      blockNumber,
      txTimestamp,
      meta,
    } = req.body;

    const {
      value: amountValue,
      currencySymbol,
      networkName,
      expectedChainId,
    } = amount;

    const donation = await createDonationRecord({
      requestId,
      fromUserId: req.userId,
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
      meta: {
        ...(meta || {}),
        userAgent: req.headers["user-agent"],
        clientIp:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket?.remoteAddress,
      },
    });

    return res.status(201).json({ donation });
  } catch (err) {
    // ... rest of the error handling remains the same
    console.error(err);
    if (err.code === "REQUEST_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    // ... (omitted for brevity)
    if (err.code === 11000 || err.code === "11000") {
      // duplicate txHash
      return res.status(409).json({ error: "Donation already recorded" });
    }
    return res.status(500).json({ error: "Server error" });
  }
}
/**
 * GET /api/donations
 * query: page, limit, requestId, fromUserId, toUserId, fromWallet, toWallet
 */
export async function listDonationsController(req, res) {
  try {
    const {
      page,
      limit,
      requestId,
      fromUserId,
      toUserId,
      fromWallet,
      toWallet,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await listDonations(
      {},
      {
        page,
        limit,
        requestId,
        fromUserId,
        toUserId,
        fromWallet,
        toWallet,
        sortBy,
        sortOrder,
      }
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET /api/donations/:id
 */
export async function getDonationController(req, res) {
  try {
    const { id } = req.params;
    const donation = await getDonationById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    return res.json({ donation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET /api/requests/:id/donations
 * list donations for a given request
 */
export async function listDonationsForRequestController(req, res) {
  try {
    const { id: requestId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const result = await listDonationsForRequest(requestId, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listMyDonationsController(req, res) {
  try {
    const response = await listMyDonations(req.userId, req.query);

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
export async function validateBeforeDonation(req, res) {
  try {
    const { requestId } = req.params;

    const request = await getRequestById(requestId);

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
    if (
      request?.target?.amount &&
      request.totals?.totalReceived >= request.target.amount
    ) {
      const err = new Error("Request has already reached its target amount");
      err.code = "TARGET_AMOUNT_REACHED";
      throw err;
    }
    return res.status(200).json({ message: "Validation successful" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
