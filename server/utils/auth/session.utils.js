import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET;

export function generateSessionId() {
  const id = crypto.randomBytes(16).toString("hex");

  const hashedId = hashSessionId(id);

  return { raw: id, hashed: hashedId };
}

// Hash session with secret
export function hashSessionId(rawSessionId) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(rawSessionId)
    .digest("hex");
}
