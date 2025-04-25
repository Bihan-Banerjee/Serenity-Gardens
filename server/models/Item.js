import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['fruit', 'vegetable', 'fish'], required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String }, // Optional image URL for the product
});

const Product = mongoose.model('Product', productSchema);
export default Product;
