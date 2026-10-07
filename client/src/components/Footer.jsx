import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, MessageCircle, MapPin, Phone, Mail, Clock, ShieldCheck, Award, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#070707] border-t border-[#C6A15B]/20 text-[#F7F2E8] pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      {/* Subtle Ambient Gold Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#C6A15B]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#C6A15B] flex items-center justify-center bg-[#0B0B0B]">
              <span className="font-playfair text-[#C6A15B] font-bold text-xl">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-2xl tracking-widest text-[#F7F2E8]">LUMIÈRE</span>
              <span className="text-[10px] tracking-[0.25em] text-[#C6A15B]">MICHELIN ★★★</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            A haute gastronomy sanctuary delivering avant-garde 3D culinary art and timeless elegance.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#C6A15B] hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 transition-colors">
              <Globe size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#C6A15B] hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 transition-colors">
              <Share2 size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#C6A15B] hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 transition-colors">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 className="font-playfair text-lg text-[#C6A15B] mb-6 tracking-wider">Navigation</h4>
          <ul className="space-y-3 text-sm font-light text-gray-300">
            <li><Link to="/" className="hover:text-[#C6A15B] transition-colors">Home Experience</Link></li>
            <li><Link to="/menu" className="hover:text-[#C6A15B] transition-colors">À La Carte Menu</Link></li>
            <li><Link to="/menu/qr" className="hover:text-[#C6A15B] transition-colors">Instant QR Mobile Menu</Link></li>
            <li><Link to="/story" className="hover:text-[#C6A15B] transition-colors">Our Culinary Story</Link></li>
            <li><Link to="/experience" className="hover:text-[#C6A15B] transition-colors">Private Dining & Events</Link></li>
            <li><Link to="/reservations" className="hover:text-[#C6A15B] transition-colors">Reserve Table</Link></li>
            <li><Link to="/contact" className="hover:text-[#C6A15B] transition-colors">Contact Concierge</Link></li>
          </ul>
        </div>

        {/* Admin & Operations */}
        <div>
          <h4 className="font-playfair text-lg text-[#C6A15B] mb-6 tracking-wider">Administration</h4>
          <ul className="space-y-3 text-sm font-light text-gray-300">
            <li>
              <Link to="/login" className="hover:text-[#C6A15B] transition-colors flex items-center gap-2 group">
                <ShieldCheck size={16} className="text-[#C6A15B] group-hover:scale-110 transition-transform" />
                <span>Executive Admin Login</span>
              </Link>
            </li>
            <li>
              <Link to="/kitchen" className="hover:text-[#C6A15B] transition-colors flex items-center gap-2 group">
                <Award size={16} className="text-[#C6A15B] group-hover:scale-110 transition-transform" />
                <span>Kitchen Display System</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-4 text-sm font-light text-gray-300">
          <h4 className="font-playfair text-lg text-[#C6A15B] mb-6 tracking-wider">Contact & Hours</h4>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#C6A15B] shrink-0 mt-0.5" />
            <span>742 Avenue Montaigne, 75008 Paris, France</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-[#C6A15B] shrink-0" />
            <span>+33 1 42 68 55 00</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#C6A15B] shrink-0" />
            <span>reservations@lumiere.com</span>
          </div>
          <div className="flex items-start gap-3 pt-2">
            <Clock size={18} className="text-[#C6A15B] shrink-0 mt-0.5" />
            <div>
              <p>Dinner: Tue - Sun (18:30 - 23:30)</p>
              <p className="text-xs text-gray-500">Closed on Mondays</p>
            </div>
          </div>
          <div className="pt-3 border-t border-white/10">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs text-[#C6A15B] hover:text-[#E2C98A] font-medium transition-colors">
              <ShieldCheck size={14} />
              <span>Staff & Admin Console Access →</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light gap-4">
        <p>© 2026 LUMIÈRE Haute Gastronomie. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart size={14} className="text-[#C6A15B] fill-[#C6A15B]" /> for Luxury Gastronomy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
