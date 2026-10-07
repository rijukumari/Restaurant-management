import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Star } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose }) => {
  // Mobile network Wi-Fi IP or current domain
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const baseHost = isLocalhost ? 'http://192.168.1.10:5173' : window.location.origin;
  const targetMenuUrl = `${baseHost}/menu`;
  
  // High-Resolution 100% Scannable QR Code
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=10&data=${encodeURIComponent(targetMenuUrl)}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-sm w-full rounded-3xl p-6 sm:p-8 overflow-hidden bg-[#111111] shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-[#F7F2E8] text-center"
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#C6A15B]/15 blur-3xl pointer-events-none"></div>

          {/* Close button (Borderless) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer z-20"
            title="Close Scanner"
          >
            <X size={18} />
          </button>

          {/* Header (Borderless) */}
          <div className="space-y-1 mb-6 relative z-10">
            <div className="flex items-center justify-center gap-1 text-[#C6A15B] mb-1">
              <Star size={11} className="fill-[#C6A15B]" />
              <Star size={11} className="fill-[#C6A15B]" />
              <Star size={11} className="fill-[#C6A15B]" />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C6A15B] font-bold block">
              LUMIÈRE CONTACTLESS DINING
            </span>
            <h3 className="font-playfair text-2xl font-bold">Digital Menu Scanner</h3>
            <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
              Apne mobile camera se QR scan karein — seedhe menu page khulega aur wahi se order place karein.
            </p>
          </div>

          {/* BORDERLESS CLEAN LUXURY QR DISPLAY */}
          <div className="relative rounded-2xl bg-[#181818] p-5 shadow-2xl">
            {/* Crest Top */}
            <div className="flex items-center justify-between pb-3 mb-3 text-xs opacity-90">
              <div className="flex items-center gap-2">
                <span className="font-playfair text-sm tracking-widest text-[#E2C98A] font-bold">LUMIÈRE</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#C6A15B] font-bold px-2 py-0.5 rounded bg-black/40">
                TABLE QR
              </span>
            </div>

            {/* High-Resolution Scannable QR Code */}
            <div className="relative mx-auto w-60 h-60 bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center">
              <img 
                src={qrCodeImageUrl} 
                alt="Lumière Menu QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Bottom Instructions (Borderless) */}
            <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-xs text-[#E2C98A] font-medium">
              <Smartphone size={15} className="text-[#C6A15B] shrink-0 animate-bounce" />
              <span>Point smartphone camera to scan</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRScannerModal;
