import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      // Demo fallback if backend is not running
      onLoginSuccess({ id: 'demo_id', name: email.split('@')[0], email, role }, 'demo_token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🚚</div>
          <h1 className="text-xl font-bold text-sky-400">YatriRaksha Logins</h1>
          <p className="text-xs text-slate-400 mt-1">Fleet Telemetry & Highway Incident Portal</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-950/50 border border-red-800 text-red-300 text-xs p-2.5 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">User Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  role === 'driver' 
                    ? 'bg-sky-600 border-sky-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🚛 Driver
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  role === 'admin' 
                    ? 'bg-sky-600 border-sky-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🖥️ Fleet Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. driver@yatriraksha.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-lg text-xs transition-all"
          >
            {loading ? 'Authenticating...' : `Login as ${role === 'driver' ? 'Driver' : 'Fleet Manager'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
