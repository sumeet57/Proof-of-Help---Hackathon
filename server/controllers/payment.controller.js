import {
  createCheckoutOrder,
  verifyPaymentStatus,
  handleCashfreeWebhook,
  userDroppedPayment,
} from "../services/payment.service.js";
import {
  isPaymentServiceEnabled,
  togglePaymentService,
} from "../utils/payment.utils.js";

export const paymentServiceStatus = async (req, res) => {
  try {
    const status = isPaymentServiceEnabled();
    res.status(200).json({ enabled: status });
  } catch (error) {
    console.error("Error fetching payment service status:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching service status." });
  }
};
export const paymentServiceToggle = async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "Field must be a boolean." });
    }
    await togglePaymentService(enabled);
    res.status(200).json({ message: "Payment service status updated." });
  } catch (error) {
    console.error("Error toggling payment service:", error);
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { pointType, pointCount } = req.body;
    const result = await createCheckoutOrder({
      userId,
      pointType,
      pointCount,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Checkout Controller Error:", error);
    return res.status(500).json({ error: "Checkout failed." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { OrderId } = req.body;
    const result = await verifyPaymentStatus(OrderId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Verify Controller Error:", error);
    return res.status(500).json({ error: "Verification failed." });
  }
};

export const cashfreeWebhook = async (req, res) => {
  try {
    const result = await handleCashfreeWebhook(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Webhook Controller Error:", err);
    return res.status(500).json({ error: "Error processing webhook." });
  }
};

export const userDroppedController = async (req, res) => {
  const { OrderId } = req.body;
  try {
    const result = await userDroppedPayment(OrderId);
    if (result.status === 200) {
      return res
        .status(200)
        .json({ message: "Payment marked as user dropped." });
    }
  } catch (error) {
    console.error("Error marking payment as user dropped:", error);
    return res.status(500).json({ error: "UserDropped : Server Error" });
  }
};
