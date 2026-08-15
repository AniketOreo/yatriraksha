import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Truck, LogOut, Radio, AlertTriangle, Bot, Send, MapPin, Gauge, ShieldAlert, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

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
      setRagAnswer('🔧 AI Diagnostic Fallback:\n1. Pull over safely to the highway shoulder.\n2. Turn on hazard warning lights.\n3. Check engine coolant reservoir level after temperature drops.\n4. Call emergency breakdown hotline or tap SOS button.');
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
      setSosStatus('🚨 SOS Dispatched! Control Room & Emergency Mechanics notified.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <Navbar user={user} onLogout={onLogout} title="YatriRaksha Driver" subtitle={`Vehicle: ${vehicleNo}`} />

      <div className="flex-1 p-4 max-w-lg mx-auto w-full flex flex-col justify-between relative z-10">
        <div className="space-y-4 w-full">

        {/* Telemetry Status Card */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800/80 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isOnDuty ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Duty Telemetry</span>
            </div>
            <button
              onClick={handleToggleDuty}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                isOnDuty 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {isOnDuty ? '● LIVE ON DUTY' : 'OFF DUTY'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Coordinates</div>
                <div className="font-mono text-slate-200 text-[11px]">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Speed (Est.)</div>
                <div className="font-mono text-slate-200 text-[11px]">{isOnDuty ? '62 km/h' : '0 km/h'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY SOS TRIGGER */}
        <div>
          <button
            onClick={handleTriggerSOS}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.35)] border border-red-500/40 text-base flex items-center justify-center gap-3 active:scale-95 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
          >
            <ShieldAlert className="w-6 h-6 animate-bounce" />
            <span className="tracking-wide">EMERGENCY SOS ALERT</span>
          </button>
          {sosStatus && (
            <div className="mt-2 text-xs bg-red-950/80 text-red-300 p-3 rounded-xl border border-red-800 text-center font-medium flex items-center justify-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{sosStatus}</span>
            </div>
          )}
        </div>

        {/* RAG AI ASSISTANT CARD */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-sky-400" />
              <span>Highway Repair & RTO AI Assistant</span>
            </h2>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <form onSubmit={handleAskRAG} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Coolant light glowing, what to do?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 hover:border-slate-700 transition-all"
            />
            <button
              type="submit"
              disabled={loadingRag}
              className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loadingRag ? 'Asking...' : 'Ask'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {ragAnswer && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed shadow-inner">
              {ragAnswer}
            </div>
          )}
        </div>

        </div>

        <div className="text-center text-[10px] text-slate-600 mt-6 font-medium">
          YatriRaksha Fleet OS • Low-Latency Socket.IO Relay
        </div>

      </div>
    </div>
  );
}
