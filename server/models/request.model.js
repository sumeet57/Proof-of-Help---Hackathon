import mongoose from "mongoose";

const TargetSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    currencySymbol: { type: String, default: "ETH" },
    networkName: { type: String, default: "Sepolia" },
    expectedChainId: { type: Number, required: true },
  },
  { _id: false }
);
const TotalsSchema = new mongoose.Schema(
  {
    totalReceived: { type: Number, default: 0 },
    donorsCount: { type: Number, default: 0 },
    lastDonationAt: { type: Date },
  },
  { _id: false }
);

const RequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ["education", "medical", "disaster", "food", "other"],
      default: "other",
      index: true,
    },
    target: {
      type: TargetSchema,
      default: () => ({}),
    },
    totals: {
      type: TotalsSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ["open", "closed", "flagged"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true }
);

RequestSchema.index({ status: 1, createdAt: -1 });
RequestSchema.index({ "totals.totalReceived": -1 });

const Request = mongoose.model("Request", RequestSchema);
export default Request;
