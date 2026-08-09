import User from '../models/User.js';
import Incident from '../models/Incident.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join control room or individual driver room
    socket.on('join:room', (data) => {
      if (data.role === 'admin') {
        socket.join('room:admin:control_room');
        console.log(`[Socket.IO] Admin joined control room: ${socket.id}`);
      } else if (data.role === 'driver') {
        socket.join(`room:driver:${data.userId}`);
        console.log(`[Socket.IO] Driver joined room: ${data.userId}`);
      }
    });

    // Handle real-time driver telemetry streaming
    socket.on('driver:telemetry', async (data) => {
      const { userId, vehicleNo, lat, lng, speed } = data;

      // Update in DB asynchronously
      try {
        await User.findByIdAndUpdate(userId, {
          currentLocation: { lat, lng, speed, updatedAt: new Date() }
        });
      } catch (err) {
        console.error('[Telemetry DB Error]', err.message);
      }

      // Broadcast to Admin Control Room map
      io.to('room:admin:control_room').emit('admin:locationBroadcast', {
        userId,
        vehicleNo,
        lat,
        lng,
        speed,
        timestamp: new Date()
      });
    });

    // Handle Driver SOS trigger
    socket.on('driver:sosTriggered', async (data) => {
      const { userId, vehicleNumber, emergencyType, lat, lng } = data;

      try {
        const incident = await Incident.create({
          driver: userId,
          vehicleNumber,
          emergencyType,
          location: { lat, lng },
          status: 'Open'
        });

        // Broadcast urgent alarm to Admin Control Room
        io.to('room:admin:control_room').emit('admin:sosAlert', {
          incidentId: incident._id,
          userId,
          vehicleNumber,
          emergencyType,
          location: { lat, lng },
          createdAt: incident.createdAt
        });

        console.log(`[SOS TRIGGERED] Incident created ID: ${incident._id}`);
      } catch (err) {
        console.error('[SOS Error]', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
