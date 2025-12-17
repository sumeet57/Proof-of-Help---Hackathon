import crypto from "crypto";

export function cashfreeSignatureVerifier(req, res, next) {
  // 1) Get headers
  const timestamp = req.headers["x-webhook-timestamp"];
  const receivedSignature = req.headers["x-webhook-signature"];

  if (!timestamp || !receivedSignature) {
    return res.status(400).send("Missing webhook headers");
  }

  // 2) Get raw body as string
  const rawBodyBuffer = req.rawBody;
  if (!rawBodyBuffer) {
    return res.status(400).send("Raw body missing");
  }

  const rawBody = rawBodyBuffer.toString();

  const secretKey =
    process.env.CASHFREE_SECRET_ID || process.env.CASHFREE_SECRET_KEY;

  if (!secretKey) {
    return res
      .status(500)
      .send("Server misconfigured: missing Cashfree secret key");
  }

  // 4) Compute expected signature
  const dataToSign = timestamp + rawBody;
  const computedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("base64");

  if (computedSignature !== receivedSignature) {
    return res.status(401).send("Invalid signature");
  }

  console.log("✅ SIGNATURE VERIFIED");
  return next();
}
