import {
  createDonationRecord,
  getDonationById,
  listDonations,
  listDonationsForRequest,
} from "../services/donation.service.js";

/**
 * POST /api/donations
 * Called AFTER web3 tx success on frontend.
 * body:
 * {
 *   requestId,
 *   toUserId,
 *   fromWallet,
 *   toWallet,
 *   amountValue,
 *   currencySymbol,
 *   network,
 *   txHash,
 *   blockNumber,
 *   txTimestamp,
 *   meta
 * }
 */
export async function createDonationController(req, res) {
  try {
    const {
      requestId,
      toUserId,
      fromWallet,
      toWallet,
      amountValue,
      currencySymbol,
      network,
      txHash,
      blockNumber,
      txTimestamp,
      meta,
    } = req.body;

    const donation = await createDonationRecord({
      requestId,
      fromUserId: req.userId,
      toUserId,
      fromWallet,
      toWallet,
      amountValue: Number(amountValue),
      currencySymbol,
      network,
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
    console.error(err);
    if (err.code === "REQUEST_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    if (err.code === "REQUEST_NOT_OPEN") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === "INVALID_TARGET_USER") {
      return res.status(400).json({ error: err.message });
    }
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
