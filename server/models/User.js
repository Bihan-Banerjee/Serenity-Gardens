import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  // Optional contact details used by the mobile app to pre-fill checkout.
  // Absent on every user created before these fields existed.
  phone: { type: String, trim: true, maxlength: 20 },
  address: { type: String, trim: true, maxlength: 500 },
  isAdmin: { type: Boolean, default: false }
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
