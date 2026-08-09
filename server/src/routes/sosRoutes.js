import express from 'express';
import Incident from '../models/Incident.js';

const router = express.Router();

// Get active open SOS incidents for Fleet Control Room
router.get('/active', async (req, res) => {
  try {
    const incidents = await Incident.find({ status: { $ne: 'Resolved' } })
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Incident Status (e.g. Assign mechanic)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, mechanicName, mechanicPhone, etaMinutes } = req.body;
    const updateData = { status };
    if (mechanicName) {
      updateData.assignedMechanic = { name: mechanicName, phone: mechanicPhone, etaMinutes };
    }

    const incident = await Incident.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
