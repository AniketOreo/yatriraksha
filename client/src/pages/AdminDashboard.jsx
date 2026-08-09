import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function AdminDashboard({ user, onLogout }) {
  const [vehicles, setVehicles] = useState({});
  const [sosAlerts, setSosAlerts] = useState([]);

  useEffect(() => {
    // Join control room socket
    socket.emit('join:room', { role: 'admin' });

    // Listen for live location broadcasts
    socket.on('admin:locationBroadcast', (data) => {
      setVehicles((prev) => ({
        ...prev,
        [data.vehicleNo]: data
      }));
    });

    // Listen for urgent SOS alerts
    socket.on('admin:sosAlert', (alertData) => {
      setSosAlerts((prev) => [alertData, ...prev]);
    });

    return () => {
      socket.off('admin:locationBroadcast');
      socket.off('admin:sosAlert');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <h1 className="text-lg font-bold text-sky-400">YatriRaksha Control Room Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Logged in as: <strong className="text-slate-200">{user?.name || 'Admin'}</strong></span>
          <button onClick={onLogout} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        
        {/* Left Column: SOS Incident Alerts & Fleet List */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Active SOS Panel */}
          <div className="bg-slate-900 border border-red-900/50 rounded-xl p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
              <span>🚨 Active SOS Alerts ({sosAlerts.length})</span>
            </h2>
            {sosAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No active highway emergency alerts.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sosAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-red-950/40 border border-red-800/60 p-3 rounded-lg text-xs">
                    <div className="font-bold text-red-300">Vehicle: {alert.vehicleNumber}</div>
                    <div className="text-slate-400">Type: {alert.emergencyType}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Location: {alert.location?.lat.toFixed(4)}, {alert.location?.lng.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Vehicles Telemetry List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              Active Telemetry Streams ({Object.keys(vehicles).length})
            </h2>
            {Object.keys(vehicles).length === 0 ? (
              <p className="text-xs text-slate-500 italic">Waiting for drivers to stream live GPS...</p>
            ) : (
              <div className="space-y-2">
                {Object.values(vehicles).map((v, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">{v.vehicleNo}</div>
                      <div className="text-[10px] text-slate-400">{v.speed} km/h • GPS Active</div>
                    </div>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Google Maps Placeholder Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            National Highway Telemetry & Marker Canvas
          </h2>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="text-center p-6">
              <div className="text-4xl mb-2">🗺️</div>
              <h3 className="text-sm font-semibold text-slate-300">Google Maps Canvas Integration</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Real-time WebSocket truck markers and garage locations will render dynamically on this canvas using <code className="text-sky-400">@react-google-maps/api</code>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
