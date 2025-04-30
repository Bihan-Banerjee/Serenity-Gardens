import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, 
  stock: { type: Number, required: true, default: 0 }, 
  finalized: { type: Boolean, default: false }
});

export default mongoose.model("Item", ItemSchema);