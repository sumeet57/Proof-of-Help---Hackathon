import Joi from "joi";

const amountSchema = Joi.object({
  value: Joi.number()
    .min(0.000000000000000001) // Smallest possible unit in crypto
    .required()
    .messages({
      "number.base": "Donation amount must be a number",
      "number.min": "Donation amount must be greater than zero",
      "any.required": "Donation amount is required",
    }),
  currencySymbol: Joi.string().trim().uppercase().default("ETH").messages({
    "string.base": "Currency symbol must be a string",
  }),
  network: Joi.string().trim().lowercase().default("sepolia").messages({
    "string.base": "Network must be a string",
  }),
}).required();

// Joi schema for initiating a new donation (client payload)
export const createDonationSchema = Joi.object({
  request: Joi.string().hex().length(24).required().messages({
    "string.base": "Request ID must be a string",
    "string.length": "Request ID must be a 24-character hexadecimal string",
    "any.required": "Request ID is required",
  }),

  fromUser: Joi.string().hex().length(24).required().messages({
    "string.base": "Donor User ID must be a string",
    "string.length": "Donor User ID must be a 24-character hexadecimal string",
    "any.required": "Donor User ID is required",
  }),

  fromWallet: Joi.string().trim().lowercase().required().messages({
    "string.base": "Source wallet address must be a string",
    "string.empty": "Source wallet address is required",
    "any.required": "Source wallet address is required",
  }),

  amount: amountSchema,

  txHash: Joi.string().trim().lowercase().required().messages({
    "string.base": "Transaction hash must be a string",
    "string.empty": "Transaction hash is required",
    "any.required": "Transaction hash is required",
  }),

  meta: Joi.object({
    userAgent: Joi.string().optional(),
    clientIp: Joi.string().ip().optional(),
    extra: Joi.any().optional(),
  }).optional(),
});
