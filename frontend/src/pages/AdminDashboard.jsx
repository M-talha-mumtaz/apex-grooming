import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Check, X, Search, Calendar, LogOut, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  
  const { user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, config);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateStatus = async (id, status) => {
    if (status === 'rejected') {
      if (!window.confirm('Are you sure you want to reject this booking?')) {
        return;
      }
    }
    try {
      // Optimistic update
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}/status`, { status }, config);
      showToast(`Booking ${status} successfully`);
    } catch (err) {
      console.error(err);
      fetchBookings(); // Revert on fail
      showToast(`Failed to update booking`);
    }
  };

  const deleteBooking = async (id) => {
    if(window.confirm('Are you sure you want to completely delete this booking?')) {
      try {
        setBookings(prev => prev.filter(b => b._id !== id));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}`, config);
        showToast('Booking deleted');
      } catch (err) {
        console.error(err);
        fetchBookings();
        showToast('Failed to delete booking');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Memoized filters and stats
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.clientPhone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesDate = dateFilter === '' || new Date(b.date).toISOString().split('T')[0] === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      today: bookings.filter(b => new Date(b.date).toISOString().split('T')[0] === today).length
    };
  }, [bookings]);

  return (
    <div className="min-h-screen pt-4 pb-20 px-6 max-w-7xl mx-auto text-zinc-200">
      {/* Header and Logout */}
      <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-gold">Dashboard</h1>
          <p className="text-zinc-500 mt-2 text-sm tracking-wide">Manage your salon appointments</p>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-zinc-400 hover:text-red-400 transition-colors">
          <LogOut size={18} />
          <span className="text-sm uppercase tracking-widest font-semibold">Logout</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total', value: stats.total, color: 'text-zinc-200' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-500' },
          { label: 'Accepted', value: stats.accepted, color: 'text-green-500' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-500' },
          { label: 'Today', value: stats.today, color: 'text-gold' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-zinc-900/40 p-5 border border-zinc-800 flex flex-col items-center justify-center">
            <span className={`text-3xl font-serif mb-1 ${stat.color}`}>{stat.value}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-zinc-900/20 p-4 border border-zinc-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm px-10 py-3 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm px-10 py-3 appearance-none focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative w-full md:w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm px-10 py-3 focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/80 z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        )}
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead>
            <tr className="border-b border-zinc-800 text-gold uppercase text-xs tracking-widest bg-zinc-900/60">
              <th className="py-5 px-6 font-semibold">Client</th>
              <th className="py-5 px-6 font-semibold">Service</th>
              <th className="py-5 px-6 font-semibold">Date & Time</th>
              <th className="py-5 px-6 font-semibold">Status</th>
              <th className="py-5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            <AnimatePresence>
              {filteredBookings.length === 0 && !isLoading ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan="5" className="py-12 text-center text-zinc-500">No bookings match your current filters.</td>
                </motion.tr>
              ) : (
                filteredBookings.map((b) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={b._id} 
                    className="hover:bg-zinc-800/20 group transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-zinc-200">{b.clientName}</p>
                      <p className="text-xs text-zinc-500 mt-1">{b.clientEmail}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{b.clientPhone}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-400 font-medium">{b.serviceNames?.length > 0 ? b.serviceNames.join(', ') : (b.serviceName || b.service?.name || 'Unknown Service')}</td>
                    <td className="py-4 px-6 text-sm text-zinc-400">
                      <span className="text-zinc-300 block mb-1">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-zinc-500">{b.timeSlot}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold inline-block
                        ${b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                          b.status === 'accepted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                          'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center space-x-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(b._id, 'accepted')} className="text-green-500 hover:text-green-400 hover:scale-110 transition-transform" title="Accept">
                              <Check size={18} />
                            </button>
                            <button onClick={() => updateStatus(b._id, 'rejected')} className="text-yellow-500 hover:text-yellow-400 hover:scale-110 transition-transform" title="Reject">
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteBooking(b._id)} className="text-zinc-600 hover:text-red-400 hover:scale-110 transition-all" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-50 bg-zinc-900 border border-gold text-gold px-6 py-4 shadow-2xl flex items-center space-x-3"
          >
            <Check size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
