import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      
      // Clear fields before navigating for security
      setEmail('');
      setPassword('');
      
      setUser(data);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setPassword(''); // Clear password on failure
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-md mx-auto">
      <h1 className="text-4xl font-serif text-gold text-center mb-10">Admin Login</h1>
      {error && <div className="text-red-400 text-center mb-6">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
        <div>
          <label className="block text-zinc-400 text-sm mb-2 uppercase tracking-widest">Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="new-email"
            placeholder="admin@example.com"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-4 focus:outline-none focus:border-gold transition-colors" 
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-sm mb-2 uppercase tracking-widest">Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-4 focus:outline-none focus:border-gold transition-colors" 
          />
        </div>
        <button type="submit" className="w-full py-4 bg-gold text-zinc-950 hover:bg-amber-300 font-semibold uppercase tracking-widest text-xs transition-all active:scale-[0.98]">
          Secure Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
