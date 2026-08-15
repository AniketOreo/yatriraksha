import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Wrench, ShieldAlert, CheckCircle2, Navigation, Activity, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const socket = io('http://localhost:5000');

export default function MechanicDashboard({ user, onLogout }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    socket.emit('join:room', { role: 'mechanic', userId: user?.id || 'demo_mechanic' });

    socket.on('admin:sosAlert', (alertData) => {
      setSosAlerts((prev) => [alertData, ...prev]);
    });

    return () => {
      socket.off('admin:sosAlert');
    };
  }, [user]);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  const acceptJob = (alert) => {
    setActiveJob(alert);
    setSosAlerts((prev) => prev.filter(a => a.incidentId !== alert.incidentId));
    // In a real app, emit an event here to notify the server and the driver that the job is accepted.
    alert('Job Accepted! Live tracking initiated.');
  };

  const resolveJob = () => {
    setActiveJob(null);
    alert('Job Resolved & Digital Job Card Submitted!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar user={user} onLogout={onLogout} title="YatriRaksha Repair Operations" subtitle="Emergency Mechanic Dispatch Console" />

      <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
        
        {/* Top Status Bar */}
        <div className="glass-panel border border-slate-800/80 rounded-2xl p-4 flex justify-between items-center mb-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Activity className={`w-5 h-5 ${isAvailable ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <h2 className="text-sm font-bold text-slate-200">Dispatch Status</h2>
              <p className="text-[11px] text-slate-400">Receive nearby SOS alerts</p>
            </div>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={activeJob !== null}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isAvailable 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {isAvailable ? '● AVAILABLE FOR DISPATCH' : 'OFF DUTY'}
          </button>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Active SOS Radar */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col min-h-[400px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>Incoming SOS Radar</span>
            </h2>

            {!isAvailable ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                <Wrench className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Go "Available" to receive emergency dispatches.</p>
              </div>
            ) : sosAlerts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border border-slate-800 rounded-xl bg-slate-900/50 relative overflow-hidden">
                <div className="absolute inset-0 border-4 border-sky-500/10 rounded-full animate-ping [animation-duration:3s] scale-150"></div>
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 mb-2"></div>
                <p className="text-xs font-medium z-10">Scanning for nearby breakdowns...</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-1">
                {sosAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-red-400 mb-0.5">Emergency SOS</h3>
                          <p className="text-[11px] text-slate-300">Vehicle: <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-sky-300">{alert.vehicleNumber}</span></p>
                        </div>
                        <span className="bg-red-900/80 text-red-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          {alert.emergencyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3 bg-slate-900/50 p-2 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>Distance: ~4.2 km (NH-44)</span>
                      </div>
                      
                      <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg mb-3">
                        <p className="text-[10px] font-semibold text-amber-400 mb-1 flex items-center gap-1"><Wrench className="w-3 h-3"/> AI Diagnostic Pre-Brief:</p>
                        <p className="text-[10px] text-slate-300 italic">"Suspect radiator/coolant issue based on driver query. Recommend carrying coolant and thermal gloves."</p>
                      </div>

                      <button 
                        onClick={() => acceptJob(alert)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Accept Job & Navigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Active Job Card */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Current Active Job</span>
            </h2>

            {!activeJob ? (
               <div className="flex-1 flex items-center justify-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
                 <p className="text-xs">No active repair jobs.</p>
               </div>
            ) : (
              <div className="flex-1 flex flex-col relative">
                <div className="absolute top-0 right-0">
                   <span className="animate-pulse flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">Vehicle {activeJob.vehicleNumber}</h3>
                  <p className="text-xs text-sky-400">En Route • Live GPS Sharing Active</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-3 flex-1">
                   <div>
                     <p className="text-[10px] text-slate-500 uppercase tracking-wide">Emergency Type</p>
                     <p className="text-sm text-slate-200 font-medium">{activeJob.emergencyType}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-500 uppercase tracking-wide">Reported Coordinates</p>
                     <p className="text-sm font-mono text-slate-300 bg-slate-950 p-1.5 rounded inline-block border border-slate-800">{activeJob.location.lat.toFixed(4)}, {activeJob.location.lng.toFixed(4)}</p>
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-slate-800">
                     <button className="w-full bg-sky-900/40 text-sky-300 border border-sky-700/50 hover:bg-sky-900/60 text-xs font-semibold py-2.5 rounded-lg mb-2 transition-all">
                       Open in Google Maps
                     </button>
                     <button className="w-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs font-semibold py-2.5 rounded-lg transition-all">
                       Call Driver
                     </button>
                   </div>
                </div>

                <button 
                  onClick={resolveJob}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
                >
                  Mark as Resolved & Generate Job Card
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
