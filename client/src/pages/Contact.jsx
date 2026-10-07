import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Send, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been received by our Head Concierge.', {
      icon: '✨',
      duration: 4000
    });
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#080808] min-h-screen text-[#F7F2E8] pt-32 pb-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Ambient Gold Glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-[#C6A15B]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1 text-[#C6A15B] mb-1">
            <Star size={12} className="fill-[#C6A15B]" />
            <Star size={12} className="fill-[#C6A15B]" />
            <Star size={12} className="fill-[#C6A15B]" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C6A15B] font-bold block">
            CONCIERGE & INQUIRIES
          </span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold">Contact Lumière</h1>
          <p className="text-gray-400 text-sm font-light">
            Our Head Concierge and Private Dining specialists are at your disposal for dining inquiries, private salons, and bespoke culinary events.
          </p>
        </div>

        {/* Contact Info & Inquiry Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card-luxury p-8 rounded-3xl border border-white/10 space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-[#E2C98A]">The Sanctuary</h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Location Address</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                      742 Avenue Montaigne, 75008 Paris, France<br />
                      Private Valet Parking Available
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Direct Concierge Line</p>
                    <a href="tel:+33142685500" className="text-xs text-gray-400 hover:text-[#C6A15B] block mt-0.5">
                      +33 1 42 68 55 00 (International)
                    </a>
                    <a href="tel:+911145678900" className="text-xs text-gray-400 hover:text-[#C6A15B] block">
                      +91 11 4567 8900 (Asia Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Electronic Mail</p>
                    <a href="mailto:concierge@lumiere.com" className="text-xs text-gray-400 hover:text-[#C6A15B] block mt-0.5">
                      concierge@lumiere.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Service Hours</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Dinner: Tuesday – Sunday (18:30 – 23:30)<br />
                      Lunch Service: Friday – Sunday (12:00 – 15:30)<br />
                      <span className="text-gray-500 italic">Closed on Mondays</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEDICATED ADMIN PORTAL BUTTON (Requested: "sirf contact page pr admin button rkhna hai") */}
            <div className="glass-card-luxury p-6 rounded-3xl border border-[#C6A15B]/40 bg-gradient-to-r from-black/80 via-[#121212] to-black/80 flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#C6A15B] font-bold block">
                  STAFF & MANAGEMENT ACCESS
                </span>
                <h4 className="font-playfair text-lg font-bold text-white">Executive Admin Panel</h4>
                <p className="text-[11px] text-gray-400">Open live restaurant dashboard & controls</p>
              </div>

              <Link
                to="/admin"
                className="btn-gold flex items-center gap-2 py-3 px-5 text-xs font-bold shrink-0 cursor-pointer shadow-[0_0_20px_rgba(198,161,91,0.4)]"
              >
                <ShieldCheck size={16} />
                <span>Open Admin Portal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="glass-card-luxury p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
              <div>
                <h3 className="font-playfair text-2xl font-bold">Transmit an Inquiry</h3>
                <p className="text-xs text-gray-400 mt-1">Our concierge typically replies within 2 hours of transmission</p>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Your message has been safely received. A concierge officer will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-medium">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lord Harrington"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-medium">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-medium">Telephone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-medium">Inquiry Nature</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="General Inquiry" className="bg-[#121212]">General Inquiry</option>
                      <option value="Private Salon Privé" className="bg-[#121212]">Private Salon Privé Booking</option>
                      <option value="Press & Media" className="bg-[#121212]">Press & Media Requests</option>
                      <option value="Sommelier Consultation" className="bg-[#121212]">Sommelier Cellar Acquisition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-medium">Detailed Message</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Describe your special date, party size, dietary requests, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B] resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-xs font-bold cursor-pointer"
                >
                  <Send size={16} />
                  <span>Transmit Inquiry to Concierge</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
