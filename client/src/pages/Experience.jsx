import React from 'react';
import { motion } from 'framer-motion';
import { Wine, Sparkles, UtensilsCrossed, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Experience = () => {
  const experiences = [
    {
      id: 'chefs-table',
      title: "Chef's Table Grand Experience",
      subtitle: 'Exclusive 14-Course Tasting in the Heart of the Kitchen',
      desc: 'Witness culinary artistry up close. Sit directly adjacent to Executive Chef Antoine as he orchestrates a custom multi-course tasting paired with vintage reserve grand crus.',
      guests: 'Max 8 Guests',
      duration: '3.5 Hours',
      price: '$450 / Guest',
      img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'sommelier-cellar',
      title: 'Sommelier Reserve Wine Cellar',
      subtitle: 'Private Wine Tasting & Charcuterie Vault',
      desc: 'Descend into our subterranean 19th-century brick cellar housing over 4,500 rare vintages. Guided by Master Sommelier Hélène Mercier.',
      guests: 'Max 12 Guests',
      duration: '2.5 Hours',
      price: '$320 / Guest',
      img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'rooftop-dome',
      title: 'Celestial Glass Dome Dining',
      subtitle: 'Panoramic Skyline Views Under the Stars',
      desc: 'Dine in a private climate-controlled glass dome overlooking Paris skyline. Features customized ambient light projections and personal waiter team.',
      guests: '2 - 6 Guests',
      duration: '3 Hours',
      price: '$380 / Guest',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F2E8] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C6A15B]/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-5xl mx-auto text-center space-y-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="text-[#C6A15B] text-xs font-bold tracking-[0.3em] uppercase border border-[#C6A15B]/30 px-4 py-1.5 rounded-full bg-[#C6A15B]/5">
            EXCLUSIVE GASTRONOMIC JOURNEYS
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl md:text-6xl font-bold tracking-tight"
        >
          Curated <span className="gold-gradient-text italic">Dining Experiences</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 font-light text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Beyond dinner, LUMIÈRE offers immerse multi-sensory culinary journeys designed for extraordinary celebrations and intimate gatherings.
        </motion.p>
      </div>

      {/* Cards List */}
      <div className="max-w-6xl mx-auto space-y-16 mb-24">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`glass-card border border-[#C6A15B]/30 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-[#C6A15B]/60 transition-all duration-500`}
          >
            <div className={`lg:col-span-7 p-8 md:p-12 flex flex-col justify-between ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase">{exp.subtitle}</span>
                <h2 className="font-playfair text-3xl font-bold">{exp.title}</h2>
                <p className="text-gray-300 font-light leading-relaxed">{exp.desc}</p>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-[#C6A15B]" />
                    <span className="text-xs text-gray-300">{exp.guests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#C6A15B]" />
                    <span className="text-xs text-gray-300">{exp.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#C6A15B]" />
                    <span className="text-xs font-bold text-[#C6A15B]">{exp.price}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link 
                  to="/reservations" 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#C6A15B]/10 border border-[#C6A15B]/50 text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#0B0B0B] font-semibold rounded-full transition-all duration-300 group"
                >
                  <span>Book This Experience</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className={`lg:col-span-5 relative min-h-[300px] lg:min-h-full ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <img 
                src={exp.img} 
                alt={exp.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="max-w-4xl mx-auto text-center glass-card border border-[#C6A15B]/30 rounded-3xl p-10 space-y-6">
        <h3 className="font-playfair text-2xl md:text-3xl font-bold">Bespoke Gala & Corporate Inquiries</h3>
        <p className="text-gray-300 font-light text-sm max-w-xl mx-auto">
          Need a completely customized menu or full restaurant buyout for your brand or family event? Our culinary directors are at your service.
        </p>
        <Link 
          to="/reservations" 
          className="inline-block px-8 py-3 bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] font-bold rounded-full hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] transition-all"
        >
          Contact Events Team
        </Link>
      </div>
    </div>
  );
};

export default Experience;
