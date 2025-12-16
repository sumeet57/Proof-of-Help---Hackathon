import Joi from "joi";

const amountSchema = Joi.object({
  value: Joi.number()
    .min(0.000000000000000001) // minimum value in blockchain transactions
    .required()
    .messages({
      "number.base": "Donation amount must be a number",
      "number.min": "Donation amount must be greater than zero",
      "any.required": "Donation amount is required",
    }),
  currencySymbol: Joi.string().trim().uppercase().required().messages({
    "string.base": "Currency symbol must be a string",
    "any.required": "Currency symbol is required",
  }),
  networkName: Joi.string().trim().required().messages({
    "string.base": "Network name must be a string",
    "any.required": "Network name is required",
  }),
  expectedChainId: Joi.number().integer().min(1).required().messages({
    "number.base": "Expected Chain ID must be a number",
    "number.min": "Expected Chain ID must be a positive integer",
    "any.required": "Expected Chain ID is required",
  }),
}).required();

export const createDonationSchema = Joi.object({
  request: Joi.string().hex().length(24).required().messages({
    "string.base": "Request ID must be a string",
    "string.length": "Request ID must be a 24-character hexadecimal string",
    "any.required": "Request ID is required",
  }),
  toUser: Joi.string().hex().length(24).required().messages({
    "string.base": "Recipient User ID must be a string",
    "string.length":
      "Recipient User ID must be a 24-character hexadecimal string",
    "any.required": "Recipient User ID is required",
  }),
  fromWallet: Joi.string().trim().lowercase().required().messages({
    "string.base": "Source wallet address must be a string",
    "string.empty": "Source wallet address is required",
    "any.required": "Source wallet address is required",
  }),
  toWallet: Joi.string().trim().lowercase().required().messages({
    "string.base": "Recipient wallet address must be a string",
    "string.empty": "Recipient wallet address is required",
    "any.required": "Recipient wallet address is required",
  }),

  amount: amountSchema,

  txHash: Joi.string().trim().lowercase().required().messages({
    "string.base": "Transaction hash must be a string",
    "string.empty": "Transaction hash is required",
    "any.required": "Transaction hash is required",
  }),
  blockNumber: Joi.number().optional(),
  txTimestamp: Joi.date().iso().optional(),
  meta: Joi.object({
    userAgent: Joi.string().optional(),
    clientIp: Joi.string().ip().optional(),
    extra: Joi.any().optional(),
  }).optional(),
}).options({ allowUnknown: true });
