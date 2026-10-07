import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, Sparkles, AlertCircle, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '2 Guests',
    seatingArea: "Chef's Dining Room",
    dietary: '',
    specialRequest: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const seatingOptions = [
    { name: "Chef's Dining Room", desc: 'Classic luxury atmosphere near central open kitchen' },
    { name: 'Panoramic Window Seat', desc: 'Overlooking garden lights and Paris skyline' },
    { name: 'Private Booth', desc: 'Intimate velvet alcove with ambient soundproofing' },
    { name: 'Celestial Glass Dome', desc: 'Rooftop dining under open night sky' }
  ];

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomRef = 'LUM-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F2E8] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C6A15B]/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C6A15B] text-xs font-bold tracking-[0.3em] uppercase border border-[#C6A15B]/30 px-4 py-1.5 rounded-full bg-[#C6A15B]/5">
            HAUTE TABLE RESERVATIONS
          </span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-playfair text-4xl md:text-6xl font-bold tracking-tight"
        >
          Reserve Your <span className="gold-gradient-text italic">Dining Experience</span>
        </motion.h1>
        <p className="text-gray-400 font-light text-base max-w-xl mx-auto">
          Secure your table at LUMIÈRE. We recommend reserving at least 48 hours in advance for peak evening dining.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleSubmit}
              className="glass-card border border-[#C6A15B]/30 rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl"
            >
              {/* Personal Details */}
              <div className="space-y-6">
                <h2 className="font-playfair text-2xl font-bold text-[#C6A15B] border-b border-white/10 pb-3 flex items-center gap-2">
                  <Sparkles size={20} /> 1. Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Lord / Lady Antoine"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="guest@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Date, Time & Guests */}
              <div className="space-y-6">
                <h2 className="font-playfair text-2xl font-bold text-[#C6A15B] border-b border-white/10 pb-3 flex items-center gap-2">
                  <Calendar size={20} /> 2. Date, Time & Party Size
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Reservation Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Number of Guests</label>
                    <select 
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                        <option key={num} value={`${num} Guests`}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Preferred Time</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t} PM</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seating Choice */}
              <div className="space-y-6">
                <h2 className="font-playfair text-2xl font-bold text-[#C6A15B] border-b border-white/10 pb-3 flex items-center gap-2">
                  <Utensils size={20} /> 3. Select Atmosphere & Seating
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seatingOptions.map(opt => (
                    <div 
                      key={opt.name}
                      onClick={() => setFormData({ ...formData, seatingArea: opt.name })}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${formData.seatingArea === opt.name ? 'bg-[#C6A15B]/15 border-[#C6A15B] shadow-[0_0_15px_rgba(198,161,91,0.2)]' : 'bg-[#121212] border-white/10 hover:border-white/30'}`}
                    >
                      <h4 className="font-playfair font-semibold text-white">{opt.name}</h4>
                      <p className="text-xs text-gray-400 font-light mt-1">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div className="space-y-4">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Dietary Requirements or Special Requests</label>
                <textarea 
                  rows="3"
                  placeholder="Anniversary, birthday, gluten-free, vegan options, sommelier pairing..."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6A15B] transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] font-bold text-lg rounded-full shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:shadow-[0_0_30px_rgba(198,161,91,0.7)] transition-all transform hover:-translate-y-0.5"
              >
                Confirm Table Reservation
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card border border-[#C6A15B]/50 rounded-3xl p-10 md:p-14 text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B] flex items-center justify-center mx-auto text-[#C6A15B]">
                <CheckCircle size={48} />
              </div>

              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#C6A15B]">RESERVATION CONFIRMED</span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold">We Expect Your Arrival</h2>

              <p className="text-gray-300 font-light text-base max-w-md mx-auto">
                Thank you <strong className="text-white">{formData.name}</strong>. A confirmation email has been dispatched to <span className="text-[#C6A15B]">{formData.email}</span>.
              </p>

              <div className="bg-[#121212] border border-[#C6A15B]/30 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 font-light text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Reference Code:</span>
                  <span className="font-mono text-[#C6A15B] font-bold">{bookingRef}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-white">{formData.date} at {formData.time} PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Party Size:</span>
                  <span className="text-white">{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seating Area:</span>
                  <span className="text-white">{formData.seatingArea}</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/menu"
                  className="px-8 py-3 bg-[#C6A15B] text-[#0B0B0B] font-bold rounded-full hover:bg-[#d8b878] transition-colors"
                >
                  Browse Menu & Pre-order
                </Link>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reservation;
