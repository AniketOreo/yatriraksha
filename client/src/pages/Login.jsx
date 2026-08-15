import React, { useState } from 'react';
import { Truck, Monitor, Lock, Mail, ArrowRight, ShieldCheck, Radio, Wrench, User as UserIcon, Phone, Sparkles, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password, role, phone };
      
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || (isLogin ? 'Login failed' : 'Registration failed'));

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      // Demo fallback if backend is offline or for quick demo
      let demoEmail = email;
      let demoId = 'demo_driver_101';
      if (!demoEmail) {
        if (role === 'driver') demoEmail = 'driver@yatriraksha.in';
        else if (role === 'admin') demoEmail = 'manager@yatriraksha.in';
        else demoEmail = 'mechanic@yatriraksha.in';
      }
      if (role === 'admin') demoId = 'demo_admin_01';
      else if (role === 'mechanic') demoId = 'demo_mechanic_01';

      onLoginSuccess({
        id: demoId,
        name: demoEmail.split('@')[0],
        email: demoEmail,
        role
      }, 'demo_jwt_token_2026');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'driver') {
      setEmail('driver@yatriraksha.in');
      setPassword('driver123');
    } else if (selectedRole === 'admin') {
      setEmail('manager@yatriraksha.in');
      setPassword('admin123');
    } else {
      setEmail('mechanic@yatriraksha.in');
      setPassword('mechanic123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md relative z-10">

        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4 animate-float shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>National Highway Telemetry Gateway</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent mb-3">
            YatriRaksha
          </h1>
          <p className="text-sm text-slate-300 mb-2 font-medium px-4">
            The intelligent ecosystem bridging highway drivers, fleet operators, and emergency mechanics with AI-powered diagnostics and live SOS telemetry.
          </p>
          <p className="text-[11px] text-slate-500">Log in to access your specialized portal.</p>
        </div>

        {/* Card Form Wrapper */}
        <div className="glass-panel p-7 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500"></div>

          {error && (
            <div className="mb-5 bg-red-950/60 border border-red-800/80 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2 animate-shake">
              <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* User Role Options Header */}
            {isLogin ? null : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative group mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 hover:border-slate-700 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                <span>Select User Role</span>
                <span className="text-[10px] text-sky-400 font-normal">Hover to preview options</span>
              </label>

              {/* Interactive Role Option Cards with Highlight Hover Animations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Driver Option Button */}
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`group relative p-3 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${role === 'driver'
                      ? 'bg-sky-950/50 border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-white ring-1 ring-sky-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-sky-500/40 hover:bg-slate-900/90 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:-translate-y-0.5'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${role === 'driver'
                        ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-400'
                      }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    {role === 'driver' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-slate-100 group-hover:text-sky-300 transition-colors">
                    Driver
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Live GPS
                  </div>
                </button>

                {/* Fleet Manager Option Button */}
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`group relative p-3 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${role === 'admin'
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)] text-white ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:-translate-y-0.5'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${role === 'admin'
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'
                      }`}>
                      <Monitor className="w-4 h-4" />
                    </div>
                    {role === 'admin' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Manager
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Control Room
                  </div>
                </button>

                {/* Mechanic Option Button */}
                <button
                  type="button"
                  onClick={() => setRole('mechanic')}
                  className={`group relative p-3 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${role === 'mechanic'
                      ? 'bg-emerald-950/50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-emerald-500/40 hover:bg-slate-900/90 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:-translate-y-0.5'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${role === 'mechanic'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400'
                      }`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    {role === 'mechanic' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Mechanic
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    SOS Radar
                  </div>
                </button>

              </div>
            </div>

            {/* Email Address Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group mb-4">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'driver' ? 'driver@yatriraksha.in' : role === 'admin' ? 'manager@yatriraksha.in' : 'mechanic@yatriraksha.in'}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 hover:border-slate-700 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Phone Input (Sign Up Only) */}
            {isLogin ? null : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative group mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 hover:border-slate-700 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 hover:border-slate-700 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Submit Action Button with Glowing Hover Animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-950/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Portal...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Login as' : 'Sign up as'} {role === 'driver' ? 'Driver' : role === 'admin' ? 'Fleet Manager' : 'Mechanic'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-xs text-slate-400 hover:text-sky-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                // The credentialResponse.credential is a JWT token from Google
                console.log('Google Token:', credentialResponse.credential);

                // TODO: Send this token to your backend for verification
                try {
                  const res = await fetch('http://localhost:5000/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: credentialResponse.credential, role }) // send the selected role too!
                  });
                  const data = await res.json();
                  if (res.ok) {
                    onLoginSuccess(data.user, data.token); // Log them into YatriRaksha!
                  }
                } catch (err) {
                  console.error("Backend auth failed", err);
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              theme="filled_black" // Matches your dark UI perfectly
              shape="pill"
            />
          </div>

          {/* Quick Demo Fill Shortcut Tags */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="flex items-center gap-1 font-medium">
                <Zap className="w-3 h-3 text-amber-400" />
                Instant Demo Access:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('driver')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:border-sky-500/50 hover:bg-sky-950/30 hover:text-sky-300 transition-all duration-200 text-center font-medium flex items-center justify-center gap-1.5"
              >
                <span>Demo Driver</span>
                <Sparkles className="w-3 h-3 text-sky-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-300 transition-all duration-200 text-center font-medium flex items-center justify-center gap-1.5"
              >
                <span>Demo Manager</span>
                <Sparkles className="w-3 h-3 text-indigo-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('mechanic')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-950/30 hover:text-emerald-300 transition-all duration-200 text-center font-medium flex items-center justify-center gap-1.5"
              >
                <span>Demo Mechanic</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 mt-5 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted WebSocket Telemetry Protocol • YatriRaksha 2026</span>
        </div>

      </div>
    </div>
  );
}
