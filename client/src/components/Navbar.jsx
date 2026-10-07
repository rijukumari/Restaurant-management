import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, QrCode, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import QRScannerModal from './QRScannerModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Menu', path: '/menu' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* DESKTOP 3D NAVBAR */}
      <motion.div 
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out hidden md:flex justify-center items-start pt-5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ perspective: '1000px' }}
      >
        <div 
          className={`
            w-[92%] max-w-7xl flex items-center justify-between px-8 py-3.5 rounded-full
            transition-all duration-500 ease-in-out
            ${isScrolled 
              ? 'bg-[#0B0B0B]/90 backdrop-blur-xl border border-[#C6A15B]/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9),_0_0_20px_rgba(198,161,91,0.2)]' 
              : 'bg-[#0B0B0B]/40 backdrop-blur-md border border-white/10 shadow-lg'
            }
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: isScrolled ? 'translateZ(15px) rotateX(1deg)' : 'translateZ(0px) rotateX(0deg)'
          }}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3" style={{ transform: 'translateZ(30px)' }}>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full border-2 border-[#C6A15B] flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(198,161,91,0.5)] transition-all duration-300">
                <span className="font-playfair text-[#C6A15B] font-bold text-xl relative z-10 group-hover:scale-110 transition-transform duration-300">L</span>
                <div className="absolute inset-0 bg-[#C6A15B]/20 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-xl tracking-widest text-[#F7F2E8] group-hover:text-[#C6A15B] transition-colors duration-300">LUMIÈRE</span>
                <span className="text-[10px] tracking-[0.2em] text-[#C6A15B]/70 font-medium">MICHELIN ★★★</span>
              </div>
            </Link>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-2" style={{ transform: 'translateZ(20px)' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`
                  relative px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(198,161,91,0.4)]
                  ${location.pathname === link.path 
                    ? 'text-[#0B0B0B] bg-gradient-to-r from-[#C6A15B] to-[#D8B878] shadow-[0_0_15px_rgba(198,161,91,0.3)]' 
                    : 'text-[#F7F2E8] hover:text-[#C6A15B] hover:bg-white/5'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4" style={{ transform: 'translateZ(30px)' }}>
            <Link to="/profile" className="text-[#F7F2E8] hover:text-[#C6A15B] transition-colors duration-300 hover:-translate-y-0.5 p-2" title="Profile & Contact">
              <User size={20} />
            </Link>
            <Link to="/cart" className="text-[#F7F2E8] hover:text-[#C6A15B] transition-colors duration-300 hover:-translate-y-0.5 p-2 relative group">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A15B] text-[#0B0B0B] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* QR Scanner Trigger Button */}
            <button 
              onClick={() => setQrModalOpen(true)}
              className="ml-2 flex items-center gap-2 px-4 py-2 border border-[#C6A15B]/50 rounded-full text-[#C6A15B] text-sm hover:bg-[#C6A15B] hover:text-[#0B0B0B] font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_10px_rgba(198,161,91,0.2)]"
            >
              <QrCode size={16} />
              <span>QR Scanner</span>
            </button>

            <Link 
              to="/reservations" 
              className="ml-1 px-5 py-2 bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] rounded-full text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      </motion.div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center pointer-events-none">
        <Link to="/" className="flex items-center gap-2 pointer-events-auto">
          <div className="w-10 h-10 rounded-full border border-[#C6A15B] bg-[#0B0B0B]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="font-playfair text-[#C6A15B] font-bold text-xl">L</span>
          </div>
        </Link>

        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="w-12 h-12 rounded-full border border-[#C6A15B]/50 bg-[#0B0B0B]/90 backdrop-blur-md flex items-center justify-center text-[#C6A15B] pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-[#C6A15B]/20 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[#0B0B0B]/95 backdrop-blur-2xl flex flex-col justify-center items-center"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-6 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} className="w-full text-center">
                  <Link 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-playfair tracking-wide text-[#F7F2E8] hover:text-[#C6A15B]"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <button 
                onClick={() => { setMobileMenuOpen(false); setQrModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 border border-[#C6A15B] rounded-full text-[#C6A15B] font-semibold text-lg"
              >
                <QrCode size={20} />
                <span>Scan QR Code</span>
              </button>

              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-playfair tracking-wide text-gray-300 hover:text-[#C6A15B] flex items-center gap-2"
              >
                <User size={18} />
                <span>Profile & Contact</span>
              </Link>

              <Link 
                to="/reservations" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-8 py-3 bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] font-bold text-lg rounded-full"
              >
                Reserve Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR SCANNER MODAL */}
      <QRScannerModal 
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

