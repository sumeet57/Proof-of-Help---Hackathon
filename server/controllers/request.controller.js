import {
  createRequestForUser,
  getRequestById,
  listRequests,
  listRequestsForUser,
  updateRequestStatus,
} from "../services/request.service.js";

/**
 * POST /api/requests
 * body: { title, description, category, target }
 */
export async function createRequestController(req, res) {
  try {
    const request = await createRequestForUser(req.userId, req.body);
    return res.status(201).json({ request });
  } catch (err) {
    console.error(err);
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

/**
 * GET /api/requests
 * query: page, limit, status, category, sortBy, sortOrder
 */
export async function listRequestsController(req, res) {
  try {
    const { page, limit, status, category, sortBy, sortOrder } = req.query;

    const result = await listRequests(
      {},
      { page, limit, status, category, sortBy, sortOrder }
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET /api/requests/me
 * list logged-in user's requests
 */
export async function listMyRequestsController(req, res) {
  try {
    const { page, limit, status, category, sortBy, sortOrder } = req.query;

    const result = await listRequestsForUser(req.userId, {
      page,
      limit,
      status,
      category,
      sortBy,
      sortOrder,
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET /api/requests/:id
 */
export async function getRequestController(req, res) {
  try {
    const { id } = req.params;
    const request = await getRequestById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    return res.json({ request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * PATCH /api/requests/:id/status
 * body: { status: "open" | "closed" | "flagged" }
 * only owner can change
 */
export async function updateRequestStatusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await updateRequestStatus(id, req.userId, status);
    return res.json({ request });
  } catch (err) {
    console.error(err);
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
