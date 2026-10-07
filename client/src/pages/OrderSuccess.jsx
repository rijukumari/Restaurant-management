import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center text-center px-4 pt-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 size={48} className="text-green-500" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-playfair text-[#F7F2E8] mb-4"
      >
        Order Confirmed
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 mb-2 max-w-md"
      >
        Your order has been received by our culinary team and is being prepared with care.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-8 my-8 inline-block"
      >
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
        <p className="text-2xl font-bold text-[#C6A15B]">{id}</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link to={`/order/track/${id}`} className="btn-gold inline-flex items-center gap-2">
          Track Order Status <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
