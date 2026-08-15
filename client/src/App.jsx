import React, { useState } from 'react';
import Login from './pages/Login';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MechanicDashboard from './pages/MechanicDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'mechanic') {
    return <MechanicDashboard user={user} onLogout={handleLogout} />;
  }

  return <DriverDashboard user={user} onLogout={handleLogout} />;
}
