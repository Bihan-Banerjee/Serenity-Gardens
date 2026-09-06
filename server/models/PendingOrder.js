import mongoose from "mongoose";

const PendingOrderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  expectedAmount: { type: Number, required: true },
  consumed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

export default mongoose.model("PendingOrder", PendingOrderSchema);
