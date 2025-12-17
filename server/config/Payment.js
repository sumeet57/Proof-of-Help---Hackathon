import axios from "axios";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const clientId = process.env.CASHFREE_CLIENT_ID;
const clientSecret = process.env.CASHFREE_SECRET_ID;

if (!clientId || !clientSecret) {
  throw new Error(
    "Cashfree client ID or secret ID is not set in environment variables."
  );
}

const environment =
  process.env.CF_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

export const cashfree = new Cashfree(environment, clientId, clientSecret);

export const CASHFREE_API_URL =
  process.env.CF_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

export const cashfreeHeaders = {
  "x-client-id": clientId,
  "x-client-secret": clientSecret,
  "x-api-version": "2022-09-01",
};

export const getCashfreeOrderDetails = async (orderId) => {
  const { data } = await axios.get(`${CASHFREE_API_URL}/${orderId}`, {
    headers: cashfreeHeaders,
  });
  return data;
};

export const getCashfreePayments = async (paymentsUrl) => {
  const { data } = await axios.get(paymentsUrl, { headers: cashfreeHeaders });
  return data;
};
