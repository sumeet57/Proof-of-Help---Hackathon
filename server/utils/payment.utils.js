import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

let paymentServiceEnabled = process.env.PAYMENT_SERVICE_ENABLED === "true";
let platformFeePercentage = 5;

export const isPaymentServiceEnabled = () => paymentServiceEnabled;
export const getPlatformFeePercentage = () => platformFeePercentage;

// payment service toggle
export const togglePaymentService = async (bool) => {
  paymentServiceEnabled = bool;
};

export const mapPaymentStatus = (status) => {
  switch (status) {
    case "SUCCESS":
      return "completed";
    case "FAILED":
      return "failed";
    case "USER_DROPPED":
      return "user_dropped";
    case "EXPIRED":
      return "expired";
    default:
      return "processing";
  }
};

export const verifyCashfreeSignature = (body, signature, secret) => {
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("base64");

  return computedSignature === signature;
};

export const calculateTotalPointPrice = async (pointType, pointCount) => {
  let unitPrice = 0;
  if (pointType === "boost") {
    unitPrice = 20;
  } else if (pointType === "request") {
    unitPrice = 50;
  }
  let totalPrice = unitPrice * pointCount;

  return totalPrice;
};
