import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Award, Clock, ShoppingBag, Calendar, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Profile = () => {
  const user = useSelector((state) => state.auth.user) || {
    name: 'Lord Antoine Laurent',
    email: 'guest@lumiere.com',
    role: 'VIP Dining Member',
    phone: '+33 6 12 34 56 78'
  };

  const [activeTab, setActiveTab] = useState('orders');

  const mockOrders = [
    { id: 'ORD-8942', date: '2026-10-04', items: 'Wagyu A5 Filet Mignon x2, Truffle Bisque', total: '$380.00', status: 'Completed' },
    { id: 'ORD-7619', date: '2026-09-28', items: 'Caviar Oscietra, Vintage Dom Pérignon', total: '$640.00', status: 'Completed' }
  ];

  const mockReservations = [
    { ref: 'LUM-948102', date: '2026-10-12', time: '19:30', guests: '4 Guests', area: "Chef's Table" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F2E8] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#C6A15B]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-[#C6A15B]/40 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 rounded-full border-2 border-[#C6A15B] p-1 bg-[#121212] flex items-center justify-center relative shadow-[0_0_20px_rgba(198,161,91,0.3)]">
              <User size={48} className="text-[#C6A15B]" />
              <div className="absolute -bottom-1 -right-1 bg-[#C6A15B] text-[#0B0B0B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                VIP
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase">LUMIÈRE PRIVILEGE MEMBER</span>
              <h1 className="font-playfair text-3xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-400 font-light">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link 
              to="/admin" 
              className="px-5 py-2.5 bg-[#C6A15B]/10 border border-[#C6A15B]/40 text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#0B0B0B] font-semibold text-xs tracking-wider rounded-full transition-all flex items-center gap-2"
            >
              <ShieldCheck size={16} /> Admin Portal
            </Link>
            <Link 
              to="/kitchen" 
              className="px-5 py-2.5 bg-[#121212] border border-white/20 text-white hover:border-[#C6A15B] font-semibold text-xs tracking-wider rounded-full transition-all flex items-center gap-2"
            >
              <Award size={16} /> Kitchen View
            </Link>
          </div>
        </motion.div>

        {/* Membership Perks Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-center space-y-1">
            <p className="text-3xl font-playfair text-[#C6A15B] font-bold">1,450</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Gastronomy Reward Points</p>
          </div>
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-center space-y-1">
            <p className="text-3xl font-playfair text-[#C6A15B] font-bold">Platinum</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Tier Status</p>
          </div>
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-center space-y-1">
            <p className="text-3xl font-playfair text-[#C6A15B] font-bold">Priority</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Table Reservations</p>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="space-y-6">
          <div className="flex border-b border-white/10 gap-8">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`pb-4 text-base font-playfair tracking-wide font-bold transition-all relative ${activeTab === 'orders' ? 'text-[#C6A15B]' : 'text-gray-400 hover:text-white'}`}
            >
              Recent Dining Orders
              {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A15B]" />}
            </button>
            <button 
              onClick={() => setActiveTab('reservations')}
              className={`pb-4 text-base font-playfair tracking-wide font-bold transition-all relative ${activeTab === 'reservations' ? 'text-[#C6A15B]' : 'text-gray-400 hover:text-white'}`}
            >
              Upcoming Table Reservations
              {activeTab === 'reservations' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A15B]" />}
            </button>
          </div>

          {activeTab === 'orders' ? (
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#C6A15B]/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#C6A15B] font-bold text-sm">{order.id}</span>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-light">{order.items}</p>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                    <span className="font-playfair text-lg font-bold text-white">{order.total}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mockReservations.map(res => (
                <div key={res.ref} className="bg-[#121212] border border-[#C6A15B]/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#C6A15B] font-bold text-sm">{res.ref}</span>
                      <span className="text-xs text-[#C6A15B] bg-[#C6A15B]/10 px-2 py-0.5 rounded uppercase font-bold">Confirmed</span>
                    </div>
                    <p className="text-sm text-white font-medium">{res.area} • {res.guests}</p>
                    <p className="text-xs text-gray-400 font-light">{res.date} at {res.time} PM</p>
                  </div>
                  <Link to="/reservations" className="text-xs text-[#C6A15B] hover:underline font-semibold">
                    Modify Booking →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
