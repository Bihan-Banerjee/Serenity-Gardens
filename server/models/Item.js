import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // Optional image URL for the product
  stock: { type: Number, required: true, default: 0 }, 
});

export default mongoose.model("Item", ItemSchema);