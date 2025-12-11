import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    sessions: [
      {
        sessionIdHash: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    walletId: {
      type: String,
    },
    requests: {
      type: Number,
      default: 5,
    },
    boasts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
