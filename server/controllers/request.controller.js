import {
  createRequestForUser,
  getRequestById,
  listRequests,
  listRequestsForUser,
  updateRequestStatus,
} from "../services/request.service.js";

export async function createRequestController(req, res) {
  try {
    const request = await createRequestForUser(req.userId, req.body);
    return res.status(201).json({ request });
  } catch (err) {
    if (err.code === "NO_REQUEST_CREDITS") {
      return res.status(402).json({
        error: "Not enough request credits. Please purchase more.",
      });
    }
    if (err.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listRequestsController(req, res) {
  try {
    const { page, limit, status, category, sortBy, sortOrder } = req.query;

    const result = await listRequests(
      {},
      { page, limit, status, category, sortBy, sortOrder }
    );

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listMyRequestsController(req, res) {
  try {
    const result = await listRequestsForUser(req.userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getRequestController(req, res) {
  try {
    const { requestId } = req.params;
    const request = await getRequestById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });
    return res.json({ request });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function updateRequestStatusController(req, res) {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await updateRequestStatus(requestId, req.userId, status);
    return res.json({ request });
  } catch (err) {
    if (err.code === "INVALID_STATUS") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    if (err.code === "FORBIDDEN") {
      return res.status(403).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
}
