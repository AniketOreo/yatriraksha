import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DriverDashboard({ user, onLogout }) {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [vehicleNo, setVehicleNo] = useState('KA-01-EQ-9876');
  const [query, setQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');
  const [loadingRag, setLoadingRag] = useState(false);
  const [sosStatus, setSosStatus] = useState(null);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    socket.emit('join:room', { role: 'driver', userId: user?.id || 'demo_driver' });

    let watchId;
    if (isOnDuty) {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setCoords(newCoords);

            // Stream telemetry over Socket.IO
            socket.emit('driver:telemetry', {
              userId: user?.id || 'demo_driver',
              vehicleNo,
              lat: newCoords.lat,
              lng: newCoords.lng,
              speed: (pos.coords.speed || 60).toFixed(1)
            });
          },
          (err) => console.log('Geolocation error:', err),
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnDuty, vehicleNo, user]);

  const handleToggleDuty = () => {
    setIsOnDuty(!isOnDuty);
  };

  const handleAskRAG = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingRag(true);
    setRagAnswer('');

    try {
      const res = await fetch('http://localhost:5000/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language: 'en' })
      });
      const data = await res.json();
      setRagAnswer(data.answer);
    } catch (err) {
      setRagAnswer('Failed to fetch AI RAG guidance. Please check server connection.');
    } finally {
      setLoadingRag(false);
    }
  };

  const handleTriggerSOS = () => {
    if (window.confirm('⚠️ Confirm triggering Emergency Highway SOS Alert?')) {
      socket.emit('driver:sosTriggered', {
        userId: user?.id || 'demo_driver',
        vehicleNumber: vehicleNo,
        emergencyType: 'Breakdown',
        lat: coords.lat,
        lng: coords.lng
      });
      setSosStatus('🚨 SOS Alert Dispatched! Nearest garages and Control Room notified.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800 mb-4">
          <div>
            <h1 className="text-lg font-bold text-sky-400">🚚 YatriRaksha Driver</h1>
            <p className="text-xs text-slate-400">Vehicle: <span className="text-slate-200 font-semibold">{vehicleNo}</span></p>
          </div>
          <button onClick={onLogout} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            Logout
          </button>
        </div>

        {/* Telemetry Status Card */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Duty Telemetry Status</span>
            <button
              onClick={handleToggleDuty}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isOnDuty 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isOnDuty ? '● ON DUTY (Live GPS)' : 'OFF DUTY'}
            </button>
          </div>
          <div className="text-xs text-slate-400 grid grid-cols-2 gap-2 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>Latitude: <span className="text-slate-200 font-mono">{coords.lat.toFixed(4)}</span></div>
            <div>Longitude: <span className="text-slate-200 font-mono">{coords.lng.toFixed(4)}</span></div>
          </div>
        </div>

        {/* RED SOS BUTTON */}
        <div className="mb-6">
          <button
            onClick={handleTriggerSOS}
            className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-950/50 border border-red-500/30 text-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>🚨 EMERGENCY SOS</span>
          </button>
          {sosStatus && (
            <div className="mt-2 text-xs bg-red-950/50 text-red-300 p-2.5 rounded-lg border border-red-800 text-center font-medium">
              {sosStatus}
            </div>
          )}
        </div>

        {/* RAG AI ASSISTANT SECTION */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h2 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-1.5">
            <span>🤖 Highway RAG Repair & Legal AI</span>
          </h2>
          <form onSubmit={handleAskRAG} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Coolant light glowing, what to do?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loadingRag}
              className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              {loadingRag ? 'Searching...' : 'Ask AI'}
            </button>
          </form>

          {ragAnswer && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {ragAnswer}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 mt-4">
        YatriRaksha Fleet OS • Connected via Socket.IO
      </div>
    </div>
  );
}
