import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, CreditCard, Wallet, ChefHat } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const tableNumber = useSelector(state => state.cart.tableNumber);
  
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout
  const [formData, setFormData] = useState({ name: '', phone: '', paymentMethod: 'online' });
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + tax;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please fill all details');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate Razorpay/API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Order placed successfully!', { icon: '🎉' });
      dispatch(clearCart());
      navigate('/order/success/LUM-' + Math.floor(1000 + Math.random() * 9000));
    }, 2000);
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="min-h-[80vh] bg-[#0B0B0B] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <ChefHat size={40} className="text-[#C6A15B]/50" />
        </div>
        <h2 className="text-3xl font-playfair text-[#F7F2E8] mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-md">Looks like you haven't added any of our culinary masterpieces to your cart yet.</p>
        <Link to="/menu" className="btn-gold">Explore Menu</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-[#F7F2E8] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Items or Form */}
        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-8">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-4xl font-playfair">{step === 1 ? 'Your Order' : 'Checkout details'}</h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="cart"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {cartItems.map((item, index) => (
                  <div key={`${item.menuItem}-${index}`} className="glass-panel p-4 rounded-2xl flex gap-4 border border-white/5 relative">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex flex-col justify-between flex-grow">
                      <div className="pr-8">
                        <h3 className="font-playfair text-lg font-semibold">{item.name}</h3>
                        <p className="text-[#C6A15B] font-medium mt-1">₹{item.price}</p>
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500 mt-1 italic">Note: {item.specialInstructions}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                          <button onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"><Minus size={14} /></button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))} className="w-8 h-8 rounded-full bg-[#C6A15B] text-black flex items-center justify-center"><Plus size={14} /></button>
                        </div>
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(index))}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5"
              >
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#C6A15B] transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                      <input 
                        type="tel" required
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#C6A15B] transition-colors"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  
                  {tableNumber ? (
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Dining Location</label>
                      <div className="w-full bg-[#C6A15B]/10 border border-[#C6A15B]/30 text-[#C6A15B] rounded-xl p-4 flex items-center justify-between">
                        <span>Dining In</span>
                        <span className="font-bold">Table {tableNumber}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Order Type</label>
                      <div className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-4">
                        Takeaway / Pick-up
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Payment Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setFormData({...formData, paymentMethod: 'online'})}
                        className={`cursor-pointer rounded-xl p-4 border flex items-center gap-3 transition-all ${formData.paymentMethod === 'online' ? 'bg-[#C6A15B]/10 border-[#C6A15B] text-[#C6A15B]' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        <CreditCard size={20} />
                        <span className="font-medium">Pay Online</span>
                      </div>
                      <div 
                        onClick={() => setFormData({...formData, paymentMethod: 'counter'})}
                        className={`cursor-pointer rounded-xl p-4 border flex items-center gap-3 transition-all ${formData.paymentMethod === 'counter' ? 'bg-[#C6A15B]/10 border-[#C6A15B] text-[#C6A15B]' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        <Wallet size={20} />
                        <span className="font-medium">Pay at Counter</span>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 sticky top-32">
            <h3 className="font-playfair text-xl mb-6 border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes & Fees (5%)</span>
                <span className="text-white">₹{tax}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-8 flex justify-between items-end">
              <span className="text-lg font-medium">Grand Total</span>
              <span className="text-2xl font-bold text-[#C6A15B]">₹{grandTotal}</span>
            </div>

            {step === 1 ? (
              <button onClick={() => setStep(2)} className="btn-gold w-full flex justify-center items-center gap-2">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="btn-gold w-full flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Complete Payment <ArrowRight size={18} /></>
                )}
              </button>
            )}
            
            <div className="mt-6 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
              <span>Secure checkout provided by</span>
              <span className="font-bold tracking-wider">RAZORPAY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
