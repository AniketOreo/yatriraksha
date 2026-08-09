import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true },
  emergencyType: { 
    type: String, 
    enum: ['Breakdown', 'Accident', 'RTO Dispute', 'Medical Emergency'], 
    required: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['Open', 'Mechanic Dispatched', 'Resolved', 'Cancelled'], 
    default: 'Open' 
  },
  assignedMechanic: {
    name: String,
    phone: String,
    etaMinutes: Number
  },
  notes: String
}, { timestamps: true });

export default mongoose.model('Incident', incidentSchema);
