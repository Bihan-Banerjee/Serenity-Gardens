import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  paid: { type: Boolean, default: false },
  razorpayPaymentId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
