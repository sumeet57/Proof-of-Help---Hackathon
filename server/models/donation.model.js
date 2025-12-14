import mongoose from "mongoose";
const { Schema } = mongoose;

const AmountSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    currencySymbol: {
      type: String,
      default: "ETH",
      required: true,
    },
    // Updated fields to store the verified network details
    networkName: {
      type: String,
      required: true,
    },
    expectedChainId: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const DonationSchema = new Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    toWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    amount: {
      type: AmountSchema,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    txStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "confirmed",
    },
    blockNumber: Number,
    txTimestamp: Date,
    meta: {
      userAgent: String,
      clientIp: String,
      extra: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

DonationSchema.index({ fromWallet: 1, createdAt: -1 });
DonationSchema.index({ toWallet: 1, createdAt: -1 });
DonationSchema.index({ request: 1, createdAt: -1 });

const Donation = mongoose.model("Donation", DonationSchema);
export default Donation;
