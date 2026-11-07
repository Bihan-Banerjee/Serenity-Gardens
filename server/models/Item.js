import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, required: true, default: 0 },
  // Free text rather than an enum: the website has no category concept yet, so
  // an enum would reject values the app legitimately uses.
  category: { type: String, trim: true, maxlength: 60 },
  // Items saved before this field existed read back as "pc" because mongoose
  // applies defaults when hydrating a document. Note that .lean() skips
  // hydration, so add an explicit fallback if these routes ever use it.
  unit: { type: String, trim: true, maxlength: 20, default: 'pc' },
  finalized: { type: Boolean, default: false }
});

export default mongoose.model("Item", ItemSchema);
