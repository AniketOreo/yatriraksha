import React from 'react';
import { Truck, LogOut, User, Activity } from 'lucide-react';

export default function Navbar({ user, onLogout, title, subtitle }) {
  return (
    <header className="glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-md">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span>{title || 'YatriRaksha'}</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
              ● Live
            </span>
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-400">{subtitle || 'National Highway Telemetry'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span className="capitalize">{user?.role}: <strong className="text-slate-200">{user?.name || 'User'}</strong></span>
        </div>
        <button 
          onClick={onLogout} 
          className="text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-400 px-3 py-1.5 rounded-xl text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline-block">Logout</span>
        </button>
      </div>
    </header>
  );
}
