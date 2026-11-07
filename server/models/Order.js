import mongoose from "mongoose";

// Optional: the website posts orders without delivery details, and orders
// created before this field existed simply read back undefined.
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
  deliveryAddress: { type: DeliveryAddressSchema, default: undefined },
  // Set by the server from the route taken, never read from the request body.
  paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
