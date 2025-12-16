import Joi from "joi";

const targetSchema = Joi.object({
  amount: Joi.number().min(0.01).required().messages({
    "number.base": "Target amount must be a number",
    "number.min": "Target amount must be greater than 0.01",
    "any.required": "Target amount is required",
  }),
  currencySymbol: Joi.string().trim().uppercase().default("ETH").messages({
    "string.base": "Currency symbol must be a string",
  }),
  networkName: Joi.string().trim().required().messages({
    "string.base": "Network name must be a string",
    "any.required": "Network name is required",
  }),
  expectedChainId: Joi.number().integer().min(1).required().messages({
    "number.base": "Chain ID must be a number",
    "number.min": "Chain ID must be a positive integer",
    "any.required": "Expected Chain ID is required",
  }),
});

export const createRequestSchema = Joi.object({
  title: Joi.string().trim().required().max(150).messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.max": "Title must be at most 150 characters long",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().required().max(5000).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.max": "Description must be at most 5000 characters long",
    "any.required": "Description is required",
  }),
  category: Joi.string()
    .valid("education", "medical", "disaster", "food", "other")
    .default("other")
    .messages({
      "string.base": "Category must be a string",
      "any.only":
        "Category must be one of: education, medical, disaster, food, or other",
    }),
  target: targetSchema.required().messages({
    "any.required": "Target goal details are required",
  }),
});

export const updateRequestSchema = Joi.object({
  title: Joi.string().trim().max(150).messages({
    "string.base": "Title must be a string",
    "string.max": "Title must be at most 150 characters long",
  }),
  description: Joi.string().trim().max(5000).messages({
    "string.base": "Description must be a string",
    "string.max": "Description must be at most 5000 characters long",
  }),
  category: Joi.string()
    .valid("education", "medical", "disaster", "food", "other")
    .messages({
      "string.base": "Category must be a string",
      "any.only":
        "Category must be one of: education, medical, disaster, food, or other",
    }),
  target: targetSchema,
  status: Joi.string().valid("open", "closed", "flagged").messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be one of: open, closed, or flagged",
  }),
}).min(1);
