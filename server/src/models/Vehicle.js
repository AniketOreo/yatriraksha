import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true }, // e.g. KA-01-EQ-9876
  model: { type: String, required: true }, // e.g. Tata Signa 4825.TK
  ownerName: { type: String },
  fitnessExpiry: { type: Date },
  permitExpiry: { type: Date },
  ewayBillStatus: { type: String, enum: ['Active', 'Expired', 'Pending'], default: 'Active' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
