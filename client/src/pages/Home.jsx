import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Star, Calendar, Clock, Users, ArrowRight, 
  Award, Wine, Flame, ChevronRight, Check, ShieldCheck, 
  Utensils, PhoneCall, Compass
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const tastingCourses = [
  {
    id: 'course-1',
    number: 'I',
    courseName: "L'Éveil & Caviar Imperial",
    category: 'Amuse-Bouche',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    description: 'Oscietra Grand Reserve caviar nestled atop smoked dashi custard, gold leaf flakes, and crisp sea kelp tuile.',
    pairing: 'Dom Pérignon Vintage 2013, Champagne',
    notes: 'Saline brightness, velvety umami, delicate smokiness.',
    price: 1850,
    tags: ['Signature', 'Gluten-Free']
  },
  {
    id: 'course-2',
    number: 'II',
    courseName: 'Hokkaido Scallop & White Truffle',
    category: 'L’Océan',
    image: 'https://images.unsplash.com/photo-1599021456807-25db0f78e5c0?q=80&w=1200&auto=format&fit=crop',
    description: 'Wild diver-caught scallops pan-seared with Alba white truffle emulsion, parsnip velouté, and brown butter crumb.',
    pairing: 'Meursault Premier Cru 2020, Burgundy',
    notes: 'Sweet oceanic richness, earthy aromatic truffle finish.',
    price: 2450,
    tags: ['Chef Special', 'Seasonal']
  },
  {
    id: 'course-3',
    number: 'III',
    courseName: 'Miyazaki A5 Wagyu Tenderloin',
    category: 'Le Terroir',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop',
    description: 'Binchotan charcoal grilled A5 Wagyu with 40-year aged balsamic jus, roasted bone marrow crust, and heirloom morels.',
    pairing: 'Château Margaux Grand Cru 2010, Bordeaux',
    notes: 'Melt-in-mouth marbling, deep savory intensity, forest aromatics.',
    price: 4500,
    tags: ['Bestseller', 'Michelin Star']
  },
  {
    id: 'course-4',
    number: 'IV',
    courseName: 'Valrhona Grand Cru Sphère',
    category: 'Le Dessert',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop',
    description: '70% Guanaja chocolate dome melted table-side with warm single-origin espresso caramel, Madagascar bourbon vanilla ice cream.',
    pairing: 'Château d’Yquem Sauternes 2015',
    notes: 'Deep cacao bitterness balanced by honeyed nectar.',
    price: 1250,
    tags: ['Signature Dessert']
  }
];

const highlights = [
  {
    icon: Star,
    title: '3 Michelin Stars',
    subtitle: 'Consecutively Awarded Since 2021',
    desc: 'Recognized for culinary excellence, flawless technique, and unmatched creativity.'
  },
  {
    icon: Wine,
    title: '2,400+ Curated Vintages',
    subtitle: 'Grand Award by Wine Spectator',
    desc: 'Rare allocations from legendary châteaux and artisanal biodynamic estates worldwide.'
  },
  {
    icon: Award,
    title: "World's 50 Best #4",
    subtitle: 'Global Culinary Distinction',
    desc: 'Consistently voted among the top epicurean sanctuaries across the globe.'
  },
  {
    icon: Sparkles,
    title: 'Sensory Dining Theatre',
    subtitle: 'Private Tables & Chef’s Counter',
    desc: 'Bespoke multi-sensory journey designed by Master Chef Antoine Laurent.'
  }
];

const bentoItems = [
  {
    title: "The Sommelier's Vault",
    subtitle: "Liquid Gold & Rare Vintages",
    badge: "Cellar Experience",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
    desc: "Over 2,400 handpicked bottles, aged under optimal subterranean climate conditions, paired course-by-course.",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-7",
    linkText: "Explore Wine Program",
    linkTo: "/experience"
  },
  {
    title: "The Chef's Live Counter",
    subtitle: "8-Seat Intimate Theatrics",
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop",
    desc: "A front-row view into the master brigade preparing delicate dishes right before your eyes.",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-5",
    linkText: "Book Front Row",
    linkTo: "/reservations"
  },
  {
    title: "Glass Conservatory & Garden",
    subtitle: "Dine Beneath The Starlight",
    badge: "Atmosphere",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    desc: "High crystal vaults, verdant living foliage, and warm ambient candlelight under evening skies.",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-5",
    linkText: "Tour Ambiance",
    linkTo: "/experience"
  },
  {
    title: "The Alchemist Cocktail Salon",
    subtitle: "Botanical Elixirs & Rare Spirits",
    badge: "Mixology",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1000&auto=format&fit=crop",
    desc: "Bespoke smoked libations and custom infusions tailored to individual guest flavor profiles.",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-7",
    linkText: "Discover Cocktails",
    linkTo: "/menu"
  }
];

const Home = () => {
  const [selectedCourse, setSelectedCourse] = useState(tastingCourses[0]);
  const [partySize, setPartySize] = useState('2 Guests');
  const [diningTime, setDiningTime] = useState('20:00');
  const [serviceType, setServiceType] = useState('Dinner Degustation');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuickReserve = (e) => {
    e.preventDefault();
    navigate(`/reservations?guests=${encodeURIComponent(partySize)}&time=${encodeURIComponent(diningTime)}&service=${encodeURIComponent(serviceType)}`);
  };

  const handleAddCourseToCart = (course) => {
    dispatch(addToCart({
      menuItem: course.id,
      name: course.courseName,
      price: course.price,
      quantity: 1,
      image: course.image
    }));
    toast.success(`${course.courseName} added to your culinary selection!`, {
      icon: '✨',
      style: {
        background: '#121212',
        color: '#F7F2E8',
        border: '1px solid #C6A15B'
      }
    });
  };

  return (
    <div className="bg-[#080808] min-h-screen text-[#F7F2E8] overflow-hidden selection:bg-[#C6A15B] selection:text-black">
      {/* AMBIENT GLOW BACKDROPS */}
      <div className="fixed top-20 left-1/4 w-[600px] h-[600px] bg-[#C6A15B]/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-[#8B6E32]/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 md:px-8">
        {/* Cinematic Backdrop with Parallax Feeling */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#080808]/75 to-[#080808]"></div>
          {/* Subtle Golden Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C6A15B]/10 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
          {/* Michelin & Relais Honors Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-[#C6A15B]/40 shadow-[0_0_25px_rgba(198,161,91,0.2)] mb-8"
          >
            <div className="flex items-center text-[#C6A15B] gap-1">
              <Star size={14} className="fill-[#C6A15B]" />
              <Star size={14} className="fill-[#C6A15B]" />
              <Star size={14} className="fill-[#C6A15B]" />
            </div>
            <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#E2C98A] font-semibold">
              Three Michelin Stars 2024 · Paris & New Delhi
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-ping"></div>
          </motion.div>

          {/* Grand Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4 max-w-4xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair tracking-tight leading-[1.08]">
              The Art of Modern <br />
              <span className="gold-gradient-text italic font-serif relative">
                Haute Gastronomie
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent"></span>
              </span>
            </h1>
            <p className="text-gray-300 text-base md:text-xl font-light max-w-2xl mx-auto pt-4 leading-relaxed">
              An immersive culinary sanctuary where French classical precision embraces bold avant-garde artistry, curated by Chef Antoine Laurent.
            </p>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-5 mt-10 mb-14"
          >
            <Link 
              to="/menu" 
              className="btn-gold group flex items-center gap-3 px-8 py-4 shadow-[0_0_30px_rgba(198,161,91,0.4)]"
            >
              <span>Explore The Tasting Menu</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/reservations" 
              className="btn-outline-gold flex items-center gap-3 px-8 py-4 backdrop-blur-md bg-black/40"
            >
              <Calendar size={16} className="text-[#C6A15B]" />
              <span>Reserve Table</span>
            </Link>
          </motion.div>

          {/* QUICK LUXURY RESERVATION CONCIERGE BAR */}
          <motion.form 
            onSubmit={handleQuickReserve}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-full max-w-4xl glass-card-luxury p-3 sm:p-4 rounded-2xl md:rounded-full gold-border-glow shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
              {/* Guests */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/40 border border-white/5 hover:border-[#C6A15B]/40 transition-colors">
                <Users size={18} className="text-[#C6A15B] shrink-0" />
                <div className="text-left w-full">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Party Size</p>
                  <select 
                    value={partySize} 
                    onChange={(e) => setPartySize(e.target.value)}
                    className="bg-transparent text-sm font-medium text-[#F7F2E8] focus:outline-none w-full cursor-pointer"
                  >
                    <option value="1 Guest" className="bg-[#121212]">1 Guest</option>
                    <option value="2 Guests" className="bg-[#121212]">2 Guests (Classic)</option>
                    <option value="4 Guests" className="bg-[#121212]">4 Guests (Salon)</option>
                    <option value="6 Guests" className="bg-[#121212]">6 Guests (Chef Table)</option>
                    <option value="VIP Event" className="bg-[#121212]">VIP Private Salon (8+)</option>
                  </select>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/40 border border-white/5 hover:border-[#C6A15B]/40 transition-colors">
                <Utensils size={18} className="text-[#C6A15B] shrink-0" />
                <div className="text-left w-full">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Experience</p>
                  <select 
                    value={serviceType} 
                    onChange={(e) => setServiceType(e.target.value)}
                    className="bg-transparent text-sm font-medium text-[#F7F2E8] focus:outline-none w-full cursor-pointer"
                  >
                    <option value="Dinner Degustation" className="bg-[#121212]">Dinner Degustation</option>
                    <option value="Chef’s Counter Live" className="bg-[#121212]">Chef’s Counter (Live)</option>
                    <option value="Lunch Privilege" className="bg-[#121212]">Lunch Privilege</option>
                    <option value="Sommelier Reserve" className="bg-[#121212]">Sommelier Reserve</option>
                  </select>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/40 border border-white/5 hover:border-[#C6A15B]/40 transition-colors">
                <Clock size={18} className="text-[#C6A15B] shrink-0" />
                <div className="text-left w-full">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Service Slot</p>
                  <select 
                    value={diningTime} 
                    onChange={(e) => setDiningTime(e.target.value)}
                    className="bg-transparent text-sm font-medium text-[#F7F2E8] focus:outline-none w-full cursor-pointer"
                  >
                    <option value="19:00" className="bg-[#121212]">19:00 (Evening)</option>
                    <option value="19:30" className="bg-[#121212]">19:30 (Evening)</option>
                    <option value="20:00" className="bg-[#121212]">20:00 (Prime Dinner)</option>
                    <option value="20:30" className="bg-[#121212]">20:30 (Prime Dinner)</option>
                    <option value="21:15" className="bg-[#121212]">21:15 (Late Nocturne)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full h-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C6A15B] to-[#E2C98A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(198,161,91,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Find Table</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. PRESS & ACCOLADES MARQUEE STRIP */}
      <div className="w-full border-y border-[#C6A15B]/20 bg-gradient-to-r from-[#0C0C0C] via-[#141414] to-[#0C0C0C] py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6 text-xs uppercase tracking-[0.2em] text-[#C6A15B]/90 font-medium">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#C6A15B]" />
            <span>MICHELIN GUIDE 2024 · 3 STARS</span>
          </div>
          <div className="hidden sm:block text-gray-600">|</div>
          <div className="flex items-center gap-2">
            <Star size={16} className="text-[#C6A15B]" />
            <span>WORLD’S 50 BEST RESTAURANTS #4</span>
          </div>
          <div className="hidden sm:block text-gray-600">|</div>
          <div className="flex items-center gap-2">
            <Wine size={16} className="text-[#C6A15B]" />
            <span>WINE SPECTATOR GRAND AWARD 2023-2024</span>
          </div>
          <div className="hidden sm:block text-gray-600">|</div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#C6A15B]" />
            <span>GAULT & MILLAU 19.5/20</span>
          </div>
        </div>
      </div>

      {/* 3. FOUR PILLARS OF DISTINCTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-3">Distinguished Credentials</p>
          <h2 className="text-3xl md:text-5xl font-playfair tracking-tight">The Standards of Lumière</h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass-card-luxury p-8 rounded-2xl relative overflow-hidden group hover:border-[#C6A15B]/50 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] mb-6 group-hover:scale-110 group-hover:bg-[#C6A15B] group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(198,161,91,0.15)]">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-1 group-hover:text-[#E2C98A] transition-colors">{item.title}</h3>
                <p className="text-xs text-[#C6A15B] uppercase tracking-wider font-medium mb-3">{item.subtitle}</p>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A15B]/0 to-transparent group-hover:via-[#C6A15B]/60 transition-all duration-500"></div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE DEGUSTATION JOURNEY (HERO FEATURE) */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#080808] via-[#0E0E0E] to-[#080808] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-3">
                <Sparkles size={14} />
                <span>The Culinary Symphony</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-playfair">Chef's 8-Course Degustation</h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md font-light leading-relaxed">
              Each movement in the degustation journey represents weeks of development, honoring seasonality, texture harmonies, and Grand Cru vintage pairings.
            </p>
          </div>

          {/* Interactive Course Navigator Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-6 mb-12 scrollbar-none border-b border-white/10">
            {tastingCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                  selectedCourse.id === c.id
                    ? 'bg-gradient-to-r from-[#C6A15B] to-[#E2C98A] text-[#080808] shadow-[0_0_20px_rgba(198,161,91,0.5)]'
                    : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:border-[#C6A15B]/40'
                }`}
              >
                <span className="font-playfair text-sm">{c.number}.</span>
                <span>{c.category}</span>
              </button>
            ))}
          </div>

          {/* Active Course Stage Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCourse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center glass-card-luxury p-6 sm:p-10 rounded-3xl gold-border-glow"
            >
              {/* Dish Visual Preview */}
              <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden group">
                <img 
                  src={selectedCourse.image} 
                  alt={selectedCourse.courseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-6 left-6 flex gap-2">
                  {selectedCourse.tags.map(t => (
                    <span key={t} className="px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-[#E2C98A] border border-[#C6A15B]/40">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">Movement {selectedCourse.number}</span>
                    <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-white drop-shadow-md">{selectedCourse.courseName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-gray-300 block">Course Price</span>
                    <span className="text-2xl font-playfair font-bold text-[#E2C98A]">₹{selectedCourse.price}</span>
                  </div>
                </div>
              </div>

              {/* Dish Culinary Profile & Pairing */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-md bg-[#C6A15B]/10 text-[#C6A15B] text-[11px] uppercase tracking-widest font-bold mb-3">
                    {selectedCourse.category}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-playfair mb-4 leading-tight">{selectedCourse.courseName}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed font-light mb-6">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Pairing Box */}
                <div className="p-5 rounded-xl bg-black/60 border border-[#C6A15B]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C6A15B] font-bold">
                    <Wine size={16} />
                    <span>Grand Cru Sommelier Pairing</span>
                  </div>
                  <p className="text-sm font-medium text-white">{selectedCourse.pairing}</p>
                  <p className="text-xs text-gray-400 italic">Flavor Notes: {selectedCourse.notes}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    onClick={() => handleAddCourseToCart(selectedCourse)}
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    <Utensils size={16} />
                    <span>Add Dish To Order (₹{selectedCourse.price})</span>
                  </button>
                  <Link
                    to="/menu"
                    className="btn-outline-gold w-full text-center"
                  >
                    View All 30+ Items
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 5. ARCHITECTURAL BENTO GRID (THE SANCTUARIES) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-3">Architectural Splendor</p>
          <h2 className="text-3xl md:text-5xl font-playfair tracking-tight">The Sanctuaries of Lumière</h2>
          <p className="text-gray-400 text-sm mt-4 font-light">
            Every chamber within Lumière has been intentionally constructed with acoustic dampening, custom Italian leather, and handblown Murano crystal chandeliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {bentoItems.map((bento, i) => (
            <motion.div
              key={bento.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className={`${bento.colSpan} group relative rounded-3xl overflow-hidden glass-card-luxury min-h-[380px] flex flex-col justify-end p-8 border border-white/10 hover:border-[#C6A15B]/50 transition-all duration-500`}
            >
              <img 
                src={bento.image} 
                alt={bento.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              <div className="relative z-10 space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#E2C98A] border border-[#C6A15B]/40">
                  {bento.badge}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-white group-hover:text-[#E2C98A] transition-colors">{bento.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl">{bento.desc}</p>
                <div className="pt-2">
                  <Link 
                    to={bento.linkTo} 
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#C6A15B] group-hover:text-white transition-colors"
                  >
                    <span>{bento.linkText}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CHEF & PATRIMONY STATEMENT */}
      <section className="py-24 px-6 md:px-12 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C6A15B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop" 
                alt="Chef Antoine Laurent" 
                className="w-full h-auto object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="font-playfair text-xl font-bold text-[#E2C98A]">Chef Antoine Laurent</p>
                <p className="text-xs uppercase tracking-widest text-gray-400">Executive Chef & Visionary</p>
              </div>
            </div>
            {/* Gold Frame Outline Offset */}
            <div className="absolute -inset-4 border border-[#C6A15B]/30 rounded-2xl -z-10 transform translate-x-2 translate-y-2 pointer-events-none"></div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">
              <Sparkles size={14} />
              <span>Philosophy & Discipline</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-playfair leading-tight">
              "We do not merely serve food. We sculpt moments that <span className="gold-gradient-text italic">linger in memory</span>."
            </h2>
            <p className="text-gray-300 font-light leading-relaxed">
              Trained in the historic kitchens of Lyon and Paris, Antoine Laurent harmonizes century-old French reduction methodologies with delicate Japanese precision. Every ingredient is procured within 48 hours of harvest from private biodynamic growers.
            </p>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              At Lumière, we eliminate the distance between guest and craftsman. Every movement is deliberate, every sauce is balanced to the droplet, and every encounter is elevated to supreme ceremony.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-8">
              <div>
                <p className="font-playfair text-3xl font-bold text-[#E2C98A]">28</p>
                <p className="text-xs uppercase tracking-wider text-gray-400">Years of Discipline</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="font-playfair text-3xl font-bold text-[#E2C98A]">3 ★</p>
                <p className="text-xs uppercase tracking-wider text-gray-400">Michelin Distinctions</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="font-playfair text-3xl font-bold text-[#E2C98A]">100%</p>
                <p className="text-xs uppercase tracking-wider text-gray-400">Organic & Foraged</p>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/story" className="btn-outline-gold inline-flex items-center gap-2">
                <span>Read Full Chronicle</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIP CONCIERGE & PRIVATE SALON BANNER */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-card-luxury gold-border-glow p-8 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C6A15B]/15 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-3xl mx-auto relative z-10 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/60 border border-[#C6A15B]/40 text-xs uppercase tracking-[0.25em] text-[#E2C98A] font-semibold">
              Bespoke Events & Celebrations
            </span>
            <h2 className="text-3xl sm:text-5xl font-playfair">Host In Our Private Salon Privé</h2>
            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Available for intimate parties of up to 24 guests. Complete with dedicated private culinary brigade, bespoke menu typography, and personal Head Sommelier consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/reservations" 
                className="btn-gold px-8 py-4 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Calendar size={16} />
                <span>Inquire Private Salon</span>
              </Link>
              <a 
                href="tel:+911145678900" 
                className="btn-outline-gold px-8 py-4 flex items-center justify-center gap-2 w-full sm:w-auto bg-black/40"
              >
                <PhoneCall size={16} />
                <span>Direct Concierge (+91 11 4567 8900)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
