import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import {
  isPaymentServiceEnabled,
  mapPaymentStatus,
} from "../utils/payment.utils.js";
import {
  cashfree,
  getCashfreeOrderDetails,
  getCashfreePayments,
} from "../config/Payment.js";
import { calculateTotalPointPrice } from "../utils/payment.utils.js";
import { addBoastCredits, addRequestCredits } from "./user.service.js";

export const handleSuccessfulPayment = async (paymentSchema) => {
  const user = await User.findById(paymentSchema.user);

  if (!user) {
    return {
      status: 404,
      error: "User not found",
    };
  }

  if (paymentSchema.pointType === "boost") {
    await addBoastCredits(user._id, paymentSchema.pointCount);
  } else if (paymentSchema.pointType === "request") {
    await addRequestCredits(user._id, paymentSchema.pointCount);
  }
};

export const createCheckoutOrder = async (orderDataDetails) => {
  const { userId, pointType, pointCount } = orderDataDetails;

  const isEnabled = isPaymentServiceEnabled();
  if (!isEnabled) {
    return {
      status: 503,
      data: {
        error:
          "Payment service available only in test/dev mode (disabled by Admin)",
      },
    };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, data: { error: "User not found" } };
  }

  const price = await calculateTotalPointPrice(pointType, pointCount);

  const payment = await Payment.create({
    user: userId,
    amount: price,
    pointType,
    pointCount,
    status: "processing",
  });
  await payment.save();

  const orderData = {
    order_amount: payment.amount,
    order_currency: "INR",
    order_id: payment._id,
    customer_details: {
      customer_id: userId,
      customer_email: user.email,
      customer_name: user.name,
      customer_phone: "0000000000",
    },
    order_meta: {
      payment_methods: "upi",
    },
    order_expiry_time: new Date(Date.now() + 16 * 60 * 1000).toISOString(),
  };

  const response = await cashfree.PGCreateOrder(orderData);

  if (response?.data?.payment_session_id) {
    return {
      status: 200,
      data: {
        paymentSessionId: response.data.payment_session_id,
        orderId: payment._id,
      },
    };
  }

  await Payment.findByIdAndDelete(payment._id);
  return { status: 500, data: { error: "Failed to create payment session." } };
};

export const verifyPaymentStatus = async (OrderId) => {
  try {
    const orderDetails = await getCashfreeOrderDetails(OrderId);
    const paymentsUrl = orderDetails.payments?.url;
    if (!paymentsUrl) {
      return { status: 400, data: { error: "Payments URL not found." } };
    }
    const paymentResponse = await getCashfreePayments(paymentsUrl);
    const payments = paymentResponse?.items || paymentResponse;
    if (!payments.length) {
      return {
        status: 404,
        data: { error: "No payments found for this order." },
      };
    }
    const gatewayData = payments[0];
    const paymentStatus = gatewayData.payment_status;
    const statusEnum = mapPaymentStatus(paymentStatus);

    const paymentSchema = await Payment.findById(OrderId);
    if (!paymentSchema) {
      return { status: 404, data: { error: "Payment record not found." } };
    }
    paymentSchema.status = statusEnum;
    await paymentSchema.save();

    if (statusEnum === "completed") {
      await handleSuccessfulPayment(paymentSchema);
      return {
        status: 200,
        data: {
          message: "Payment completed successfully.",
          amount: paymentSchema.amount,
        },
      };
    }
    return { status: 400, data: { error: `Payment ${statusEnum}.` } };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { status: 500, data: { error: "Verification failed." } };
  }
};

export const handleCashfreeWebhook = async (body) => {
  try {
    const { order, payment } = body.data || {};
    if (!order?.order_id || !payment?.payment_status)
      return { status: 400, data: { error: "Invalid webhook payload." } };

    const OrderId = order.order_id;
    const paymentSchema = await Payment.findById(OrderId)
      .populate("product")
      .populate("offer");

    if (!paymentSchema)
      return { status: 404, data: { error: "Payment not found." } };

    const statusEnum = mapPaymentStatus(payment.payment_status);
    paymentSchema.status = statusEnum;
    await paymentSchema.save();

    if (statusEnum === "completed") {
      await handleSuccessfulPayment(paymentSchema);
      return {
        status: 200,
        data: { message: "Payment completed (via webhook)." },
      };
    }

    return {
      status: 200,
      data: { message: `Payment status updated: ${statusEnum}` },
    };
  } catch (error) {
    console.error("Webhook handling error:", error);
    return { status: 500, data: { error: "Webhook failed." } };
  }
};

export const userDroppedPayment = async (OrderId) => {
  try {
    const payment = await Payment.findById(OrderId);
    if (!payment) {
      return { status: 404, data: { error: "Payment not found." } };
    }
    payment.status = "user_dropped";
    await payment.save();
    return {
      status: 200,
      data: { message: "Payment marked as user dropped." },
    };
  } catch (error) {
    console.error("Error marking payment as user dropped:", error);
    return { status: 500, data: { error: "Operation failed." } };
  }
};
