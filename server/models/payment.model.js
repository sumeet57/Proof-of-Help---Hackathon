import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  pointType: { type: String, enum: ["request", "boost"], required: true },
  pointCount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["processing", "completed", "failed", "user_dropped", "expired"],
    default: "processing",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
