import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      title: String,
      quantity: Number,
    },
  ],
  paid: { type: Boolean, default: false },
});

export default mongoose.model("Order", OrderSchema);
