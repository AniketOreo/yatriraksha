import React, { useState } from 'react';
import { Truck, Monitor, Lock, Mail, ArrowRight, ShieldCheck, Radio, Wrench, User as UserIcon, Phone, Sparkles, Zap, X, MapPin, Activity, Cpu, Users, CheckCircle, Shield, AlertTriangle, Route } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LandingPage({ onLoginSuccess }) {
  const [showModal, setShowModal] = useState(false);
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

  const renderLoginModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md relative z-10 animate-float shadow-2xl">
        <button 
          onClick={() => setShowModal(false)}
          className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Top Header Card */}
        <div className="text-center mb-6 hidden">
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
        <div className="glass-panel p-7 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-slate-900/40">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500"></div>
          
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

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
                  <span>{isLogin ? 'Login as' : 'Sign up as'} {role === 'driver' ? 'Driver' : role === 'admin' ? 'Manager' : 'Mechanic'}</span>
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
              className="text-xs text-slate-400 hover:text-sky-400 transition-colors font-medium"
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
                console.log('Google Token:', credentialResponse.credential);
                try {
                  const res = await fetch('http://localhost:5000/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: credentialResponse.credential, role }) 
                  });
                  const data = await res.json();
                  if (res.ok) {
                    onLoginSuccess(data.user, data.token); 
                  }
                } catch (err) {
                  console.error("Backend auth failed", err);
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              theme="filled_black" 
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
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-300 transition-all duration-200 text-center font-medium flex items-center justify-center gap-1.5"
              >
                <span>Demo Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('mechanic')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-950/30 hover:text-emerald-300 transition-all duration-200 text-center font-medium flex items-center justify-center gap-1.5"
              >
                <span>Demo Mechanic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans scroll-smooth relative">
      
      {/* Ambient Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 1. Global Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">YatriRaksha</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#purpose" className="hover:text-sky-400 transition-colors">Purpose</a>
            <a href="#audience" className="hover:text-sky-400 transition-colors">Who it's for</a>
            <a href="#scenarios" className="hover:text-sky-400 transition-colors">Scenarios</a>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center z-10 min-h-[90vh] justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-8 animate-float shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Next-Generation Highway Telemetry</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Intelligent safety for <br />
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">every journey.</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
          Bridge the gap between highway drivers, fleet operators, and emergency mechanics with AI-powered diagnostics and live SOS telemetry radar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2"
          >
            Access Portal
            <ArrowRight className="w-5 h-5" />
          </button>
          <a 
            href="#purpose"
            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold px-8 py-3.5 rounded-full text-base transition-all flex items-center justify-center"
          >
            Discover More
          </a>
        </div>
      </section>

      {/* 3. Purpose & Core Features */}
      <section id="purpose" className="py-24 px-4 bg-slate-900/30 border-y border-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What YatriRaksha Does</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A unified ecosystem designed to eliminate response delays during highway emergencies through data-driven action.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-sky-500/50 transition-colors group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Telemetry</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Continuous streaming of vehicle speed, engine health, and precise GPS coordinates to a central control room.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Diagnostics (RAG)</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                An intelligent onboard assistant that analyzes vehicle manuals instantly to guide drivers during mechanical failures.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">SOS Radar</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                One-touch emergency triggers that instantly alert the nearest verified highway mechanics with your exact location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Target Audience */}
      <section id="audience" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Who is it designed for?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Three specialized portals. One seamless network.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
            <Truck className="w-10 h-10 text-sky-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Highway Drivers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
                <span>Instant mechanical guidance from the AI assistant.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
                <span>One-tap SOS dispatch ensures you are never stranded.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
                <span>Peace of mind on isolated highway stretches.</span>
              </li>
            </ul>
          </div>

          {/* Manager */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <Monitor className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Fleet Managers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>Monitor entire fleet health from a central control room.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>Receive live alerts the second an SOS is triggered.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>Reduce vehicle downtime and transit delays.</span>
              </li>
            </ul>
          </div>

          {/* Mechanic */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <Wrench className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Emergency Mechanics</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Get instantly pinged when a vehicle breaks down near you.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>See exact GPS coordinates on your live radar.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Expand your service reach on national highways.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Scenarios (The Need) */}
      <section id="scenarios" className="py-24 px-4 bg-slate-900/30 border-t border-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Real-World Application</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">See how YatriRaksha responds in critical situations.</p>
          </div>

          {/* Scenario 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                Scenario 1
              </div>
              <h3 className="text-3xl font-bold">Midnight Engine Failure</h3>
              <p className="text-slate-400 leading-relaxed">
                A commercial truck experiences engine failure on an isolated stretch of NH-44 at 2:00 AM. 
                Instead of searching for a mechanic in the dark, the driver presses the SOS button on their YatriRaksha dashboard.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Instantly, the nearest verified mechanic's radar lights up with the exact GPS coordinates, while the Fleet Manager's control room flashes red, allowing for immediate, coordinated rescue.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video rounded-3xl border border-slate-800 bg-slate-900/50 flex items-center justify-center overflow-hidden relative shadow-2xl">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 opacity-50"></div>
                 <Radio className="w-24 h-24 text-red-500/20 absolute" />
                 <div className="relative z-10 glass-panel p-6 rounded-2xl border border-red-500/30 flex items-center gap-4 animate-pulse-slow">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-100">CRITICAL: Engine Failure</h4>
                      <p className="text-xs text-red-300/70">Dispatching mechanic to Lat: 28.704, Lng: 77.102</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wide">
                <Cpu className="w-3.5 h-3.5" />
                Scenario 2
              </div>
              <h3 className="text-3xl font-bold">Pre-emptive AI Guidance</h3>
              <p className="text-slate-400 leading-relaxed">
                A driver notices the coolant temperature warning light flashing but isn't sure of the exact protocol for their specific vehicle model.
              </p>
              <p className="text-slate-400 leading-relaxed">
                They ask the YatriRaksha AI assistant. Using RAG (Retrieval-Augmented Generation) on official vehicle manuals, the AI immediately instructs them to pull over and let the engine idle for 2 minutes before shutdown, preventing catastrophic pressure cap burns.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video rounded-3xl border border-slate-800 bg-slate-900/50 flex items-center justify-center overflow-hidden relative shadow-2xl">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 opacity-50"></div>
                 <Activity className="w-24 h-24 text-sky-500/10 absolute" />
                 <div className="relative z-10 glass-panel p-6 rounded-2xl border border-sky-500/30 max-w-sm">
                    <p className="text-sm text-slate-300 font-medium mb-3">"What do I do if my coolant light is on?"</p>
                    <div className="bg-sky-950/30 p-3 rounded-lg border border-sky-500/20">
                      <p className="text-xs text-sky-200 leading-relaxed">
                        <span className="font-bold text-sky-400">YatriRaksha AI:</span> Pull over safely. Allow the engine to idle for 2 minutes before turning off the ignition. Do NOT open the radiator cap.
                      </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-slate-500" />
            <span className="font-bold text-lg text-slate-400">YatriRaksha</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500/70" />
            Encrypted WebSocket Telemetry Protocol © 2026
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal (conditionally rendered) */}
      {showModal && renderLoginModal()}
    </div>
  );
}
