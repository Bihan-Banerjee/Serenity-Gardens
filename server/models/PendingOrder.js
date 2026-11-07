import mongoose from "mongoose";

const DeliveryAddressSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    email: { type: String, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 20 },
    address: { type: String, trim: true, maxlength: 500 },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false }
);

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
  // Carried across to the real Order once the payment is verified.
  deliveryAddress: { type: DeliveryAddressSchema, default: undefined },
  paymentMethod: { type: String, enum: ["cod", "online"], default: "online" },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

export default mongoose.model("PendingOrder", PendingOrderSchema);
