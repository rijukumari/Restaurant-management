import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Leaf, Sparkles, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Story = () => {
  const milestones = [
    { year: '1998', title: 'The Founding', desc: 'Chef Antoine Laurent opened the doors of Lumière in Paris with a vision for modern gastronomy.' },
    { year: '2004', title: 'First Michelin Star', desc: 'Awarded 1 Michelin Star for revolutionary techniques in French classical cooking.' },
    { year: '2012', title: 'Three Michelin Stars', desc: 'Achieved the highest honor of 3 Michelin Stars, entering the global culinary pantheon.' },
    { year: '2026', title: '3D Gastronomy Era', desc: 'Pioneering futuristic 3D interactive table dining and high-tech culinary craft.' }
  ];

  const principles = [
    { icon: Leaf, title: 'Biodynamic Sourcing', desc: '100% of our produce originates from organic biodynamic micro-farms within 50 miles.' },
    { icon: Flame, title: 'Wood-Fired Mastery', desc: 'Rare artisanal wood fires using aged oak and cherry wood to impart delicate smoky aromatics.' },
    { icon: Award, title: 'Artisanal Cellar', desc: 'Over 4,500 rare vintage wines curated by Master Sommelier Hélène Mercier.' },
    { icon: Sparkles, title: '3D Visual Plating', desc: 'Blending molecular culinary science with visual aesthetic presentation.' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F2E8] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C6A15B]/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center space-y-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="text-[#C6A15B] text-xs font-bold tracking-[0.3em] uppercase border border-[#C6A15B]/30 px-4 py-1.5 rounded-full bg-[#C6A15B]/5">
            HAUTE GASTRONOMIE HERITAGE
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Our Story & <span className="gold-gradient-text italic">Culinary Soul</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 font-light text-lg max-w-3xl mx-auto leading-relaxed"
        >
          For over nearly three decades, LUMIÈRE has represented the absolute zenith of luxury fine dining. We combine centuries-old French heritage with revolutionary modern innovation.
        </motion.p>
      </div>

      {/* Chef Spotlight Card */}
      <div className="max-w-6xl mx-auto mb-28">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="glass-card border border-[#C6A15B]/30 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#C6A15B]">
              <Star className="fill-[#C6A15B]" size={18} />
              <Star className="fill-[#C6A15B]" size={18} />
              <Star className="fill-[#C6A15B]" size={18} />
              <span className="text-xs tracking-widest uppercase ml-2 text-white/70">3 Michelin Stars</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold">Chef Antoine Laurent</h2>
            <p className="text-gray-300 font-light leading-relaxed">
              "Cooking is not merely sustenance; it is emotion captured in temperature, texture, and aroma. Every plate served at Lumière is a canvas of memories and architectural symmetry."
            </p>
            <div className="pt-4 border-t border-white/10 flex items-center gap-8">
              <div>
                <p className="text-2xl font-playfair text-[#C6A15B]">28 Years</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Culinary Mastery</p>
              </div>
              <div>
                <p className="text-2xl font-playfair text-[#C6A15B]">14 Awards</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Global Gastronomy</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#C6A15B]/40 shadow-2xl h-80 lg:h-96 group">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800" 
              alt="Executive Chef" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase">Executive Master Chef</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Philosophy Grid */}
      <div className="max-w-6xl mx-auto mb-28">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold">Our Four Pillars</h2>
          <p className="text-gray-400 font-light">The fundamental tenets guiding every dish we compose</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#121212]/80 border border-white/10 rounded-2xl p-6 hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] mb-6 group-hover:bg-[#C6A15B] group-hover:text-[#0B0B0B] transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-16">Historic Timeline</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-[#C6A15B] before:to-transparent">
          {milestones.map((m, idx) => (
            <motion.div 
              key={m.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 p-6 bg-[#121212] border border-[#C6A15B]/30 rounded-2xl">
                <span className="text-[#C6A15B] font-playfair text-2xl font-bold">{m.year}</span>
                <h3 className="font-playfair text-xl font-semibold mt-1 mb-2">{m.title}</h3>
                <p className="text-sm text-gray-400 font-light">{m.desc}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#C6A15B] border-4 border-[#0B0B0B] z-10 shrink-0 shadow-[0_0_15px_#C6A15B]" />
              <div className="w-full md:w-1/2 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-8">
        <Link 
          to="/reservations"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] font-bold rounded-full text-base hover:shadow-[0_0_25px_rgba(198,161,91,0.6)] transition-all transform hover:-translate-y-1"
        >
          Reserve Your Dining Experience
        </Link>
      </div>
    </div>
  );
};

export default Story;
