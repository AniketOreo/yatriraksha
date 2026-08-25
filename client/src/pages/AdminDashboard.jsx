import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { Truck, LogOut, Radio, AlertTriangle, Map, Activity, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import { darkMapStyle } from '../components/MapStyles';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Center of India roughly
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

const socket = io('http://localhost:5000');

export default function AdminDashboard({ user, onLogout }) {
  const [vehicles, setVehicles] = useState({});
  const [sosAlerts, setSosAlerts] = useState([]);
  
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Optional auto-fit bounds when new data arrives
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasPoints = false;

      Object.values(vehicles).forEach(v => {
        bounds.extend({ lat: v.lat, lng: v.lng });
        hasPoints = true;
      });

      sosAlerts.forEach(a => {
        bounds.extend({ lat: a.location.lat, lng: a.location.lng });
        hasPoints = true;
      });

      if (hasPoints) {
        // Don't zoom in too close if there's only 1 marker
        mapRef.current.fitBounds(bounds);
        const listener = window.google.maps.event.addListener(mapRef.current, 'idle', () => {
          if (mapRef.current.getZoom() > 14) mapRef.current.setZoom(14);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [vehicles, sosAlerts, isLoaded]);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <Navbar user={user} onLogout={onLogout} title="YatriRaksha Control Room" subtitle="National Highway Telemetry & Incident Command" />

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 lg:p-6">
        
        {/* Left Column: Alerts & Active Fleet */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Active SOS Panel */}
          <div className="glass-panel border border-red-900/40 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Active SOS Incident Alerts ({sosAlerts.length})</span>
            </h2>

            {sosAlerts.length === 0 ? (
              <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-500 italic text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No emergency alerts active.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {sosAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-red-950/40 border border-red-800/60 hover:border-red-500/80 p-3 rounded-xl text-xs transition-all hover-glow-red">
                    <div className="font-bold text-red-300 flex justify-between items-center">
                      <span>Vehicle: {alert.vehicleNumber}</span>
                      <span className="text-[10px] bg-red-900/60 px-2 py-0.5 rounded-md text-red-200">SOS</span>
                    </div>
                    <div className="text-slate-400 mt-1">Type: {alert.emergencyType}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">GPS: {alert.location?.lat.toFixed(4)}, {alert.location?.lng.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Vehicles Telemetry List */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Telemetry Streams ({Object.keys(vehicles).length})</span>
            </h2>

            {Object.keys(vehicles).length === 0 ? (
              <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-500 italic text-center">
                Waiting for drivers to toggle on-duty GPS...
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {Object.values(vehicles).map((v, i) => (
                  <div key={i} className="bg-slate-950/80 border border-slate-800/80 hover:border-sky-500/50 p-3 rounded-xl text-xs flex justify-between items-center transition-all hover-glow-sky">
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-sky-400" />
                        <span>{v.vehicleNo}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{v.speed} km/h • Active Telemetry</div>
                    </div>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Google Maps Canvas */}
        <div className="lg:col-span-3 glass-panel border border-slate-800/80 rounded-2xl p-5 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Map className="w-4 h-4 text-sky-400" />
              <span>National Highway Telemetry Canvas</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Socket.IO Active</span>
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden min-h-[420px] relative border border-slate-800/90 shadow-inner">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={5}
                options={{
                  styles: darkMapStyle,
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
                onLoad={onMapLoad}
              >
                {/* Regular Vehicles */}
                {Object.values(vehicles).map((v, idx) => (
                  <Marker
                    key={`v-${idx}`}
                    position={{ lat: v.lat, lng: v.lng }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: '#38bdf8', // sky-400
                      fillOpacity: 1,
                      strokeWeight: 0,
                      scale: 8,
                    }}
                    title={v.vehicleNo}
                  />
                ))}

                {/* SOS Alerts */}
                {sosAlerts.map((alert, idx) => (
                  <Marker
                    key={`sos-${idx}`}
                    position={{ lat: alert.location.lat, lng: alert.location.lng }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: '#ef4444', // red-500
                      fillOpacity: 1,
                      strokeColor: '#7f1d1d', // red-900
                      strokeWeight: 2,
                      scale: 12,
                    }}
                    title={`SOS: ${alert.vehicleNumber}`}
                    animation={window.google.maps.Animation.BOUNCE}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-sky-400">
                <Activity className="w-8 h-8 animate-pulse mb-3" />
                <span className="font-mono text-sm">Initializing Secure Telemetry Canvas...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
