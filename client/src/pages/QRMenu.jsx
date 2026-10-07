import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Plus, Minus, Flame, Leaf, 
  CheckCircle, Calendar, Users, Phone, User, Sparkles, 
  ArrowRight, X, Clock, Utensils, ShieldCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTableNumber, addToCart, clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const mockCategories = ['All', 'Starters', 'Soups', 'Main Course', 'Desserts', 'Beverages'];

const mockMenu = [
  { _id: '1', name: 'Truffle Mushroom Bruschetta', description: 'Crispy artisan sourdough topped with wild forest mushrooms, white truffle oil, and 24-month aged Parmigiano Reggiano.', price: 850, category: 'Starters', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600' },
  { _id: '2', name: 'Wagyu Beef Tenderloin', description: 'A5 Miyazaki Wagyu beef with black truffle jus, potato mousseline, and seasonal baby vegetables.', price: 4500, category: 'Main Course', isVeg: false, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600' },
  { _id: '3', name: 'Hokkaido Scallops & Caviar', description: 'Pan-seared sea scallops with Oscietra caviar, citrus velouté, and micro herbs.', price: 1650, category: 'Starters', isVeg: false, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1599021456807-25db0f78e5c0?w=600' },
  { _id: '4', name: 'Velvety Lobster Bisque', description: 'Cognac infused Atlantic lobster reduction finished with heavy cream and fresh chervil.', price: 950, category: 'Soups', isVeg: false, spiceLevel: 'mild', isBestseller: false, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600' },
  { _id: '5', name: 'Lamb Rogan Josh Royale', description: 'Slow-braised New Zealand lamb shanks in rich aromatic saffron and Kashmiri chili reduction.', price: 1450, category: 'Main Course', isVeg: false, spiceLevel: 'hot', isBestseller: false, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600' },
  { _id: '6', name: 'Valrhona Chocolate Fondant', description: 'Warm molten 70% dark chocolate dome with Madagascar bourbon vanilla bean gelato.', price: 850, category: 'Desserts', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' },
  { _id: '7', name: 'Smoked Bourbon Old Fashioned', description: 'Barrel-aged bourbon smoked table-side with charred cedar and orange aromatic oils.', price: 950, category: 'Beverages', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600' },
];

const QRMenu = () => {
  const { tableNumber } = useParams();
  const activeTable = tableNumber || '1';
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartTotal = useSelector(state => state.cart.totalAmount);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Table Booking State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isTableBooked, setIsTableBooked] = useState(false);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestPhone: '',
    guestCount: '2',
    notes: ''
  });

  useEffect(() => {
    dispatch(setTableNumber(activeTable));
    toast.success(`Connected to Table ${activeTable}`, { icon: '🍽️', id: 'table-connect' });
  }, [activeTable, dispatch]);

  const handleConfirmTableBooking = (e) => {
    e.preventDefault();
    if (!bookingData.guestName.trim() || !bookingData.guestPhone.trim()) {
      toast.error('Please enter your name and contact phone number');
      return;
    }
    
    setIsTableBooked(true);
    setShowBookingForm(false);
    toast.success(`Table ${activeTable} booked successfully for ${bookingData.guestName}! You can now order directly from the menu.`, {
      icon: '🎉',
      duration: 4000
    });
  };

  const handleQuickAdd = (item, e) => {
    e.stopPropagation();
    dispatch(addToCart({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    }));
    toast.success(`${item.name} added to Table ${activeTable} order!`, { icon: '✨' });
  };

  const handlePlaceTableOrder = () => {
    if (cartItems.length === 0) return;
    toast.success(`Order sent to Kitchen brigade for Table ${activeTable}! Total: ₹${cartTotal}`, {
      icon: '👨‍🍳',
      duration: 4000
    });
    dispatch(clearCart());
  };

  const filteredMenu = mockMenu.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#080808] min-h-screen text-[#F7F2E8] pb-32">
      {/* 1. SCANNED TABLE CONFIRMATION STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-[#C6A15B]/30 pt-16 pb-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C6A15B] to-[#F3E5AB] text-black font-bold flex flex-col items-center justify-center shadow-[0_0_20px_rgba(198,161,91,0.3)]">
              <span className="text-[10px] uppercase font-bold leading-none">Table</span>
              <span className="font-playfair text-xl leading-none">{activeTable}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-playfair text-xl sm:text-2xl font-bold">LUMIÈRE Digital Dining</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  QR Verified
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {isTableBooked ? `Reserved for ${bookingData.guestName} (${bookingData.guestCount} Guests)` : `Table #${activeTable} · Ready for Dining & Booking`}
              </p>
            </div>
          </div>

          {/* Quick Table Booking Button */}
          <div className="flex items-center gap-3">
            {!isTableBooked ? (
              <button 
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="btn-gold flex items-center gap-2 text-xs py-2.5 px-5 cursor-pointer shadow-[0_0_15px_rgba(198,161,91,0.3)]"
              >
                <Calendar size={14} />
                <span>Book / Claim Table {activeTable}</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle size={14} />
                <span>Table {activeTable} Booked</span>
              </div>
            )}
            
            <Link to="/cart" className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A15B] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* 2. TABLE BOOKING DRAWER (Directly on scanned page) */}
        <AnimatePresence>
          {showBookingForm && !isTableBooked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mt-4 pt-4 border-t border-white/10 overflow-hidden"
            >
              <form onSubmit={handleConfirmTableBooking} className="glass-card-luxury p-5 rounded-2xl border border-[#C6A15B]/40 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#E2C98A]">Book Table {activeTable} Now</h3>
                    <p className="text-xs text-gray-400">Fill your details to reserve this table immediately and start ordering</p>
                  </div>
                  <button type="button" onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ananya Roy"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Party Size</label>
                    <select
                      value={bookingData.guestCount}
                      onChange={(e) => setBookingData({ ...bookingData, guestCount: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests (Couple)</option>
                      <option value="4">4 Guests (Family/Group)</option>
                      <option value="6">6 Guests (Party)</option>
                      <option value="8+">8+ Guests (VIP Salon)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-xs cursor-pointer"
                >
                  <CheckCircle size={16} />
                  <span>Confirm Table {activeTable} Reservation & Start Dining</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. SEARCH & CATEGORIES */}
        <div className="max-w-4xl mx-auto mt-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search dishes, ingredients, wines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C6A15B] placeholder-gray-500"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {mockCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-[#C6A15B] to-[#E2C98A] text-black font-bold' 
                    : 'bg-black/50 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DISHES REPERTOIRE LIST */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-playfair text-2xl font-bold">Culinary Menu Repertoire</h2>
          <span className="text-xs text-gray-400">{filteredMenu.length} dishes available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMenu.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="glass-card-luxury rounded-2xl overflow-hidden border border-white/10 hover:border-[#C6A15B]/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {item.isBestseller && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C6A15B]/40 flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#E2C98A]">
                      <Flame size={12} className="text-[#C6A15B]" />
                      <span>Signature</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono font-bold text-[#E2C98A] text-sm">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {item.isVeg ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1">
                        <Leaf size={10} /> Veg
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        ● Non-Veg
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{item.category}</span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold group-hover:text-[#E2C98A] transition-colors mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex justify-between items-center border-t border-white/5 mt-2">
                <span className="text-xs text-[#C6A15B] font-medium">Click to view details</span>
                <button 
                  onClick={(e) => handleQuickAdd(item, e)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#E2C98A] text-black text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(198,161,91,0.5)] transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add To Table</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. FLOATING BOTTOM ORDER BAR */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-50"
          >
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#C6A15B]/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Table {activeTable} Order:</span>
                  <span className="text-xs font-bold text-white">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items</span>
                </div>
                <p className="text-lg font-playfair font-bold text-[#E2C98A]">₹{cartTotal.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/cart"
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  Review
                </Link>
                <button
                  onClick={handlePlaceTableOrder}
                  className="btn-gold py-3 px-5 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send to Kitchen</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. DISH DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-luxury rounded-3xl max-w-lg w-full overflow-hidden border border-[#C6A15B]/40 relative"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>

              <div className="h-60 relative">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold">{selectedItem.name}</h3>
                    <p className="text-xs text-gray-400">{selectedItem.category}</p>
                  </div>
                  <span className="text-2xl font-playfair font-bold text-[#E2C98A]">₹{selectedItem.price}</span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">{selectedItem.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-400">Serving for Table {activeTable}</span>
                  <button 
                    onClick={(e) => { handleQuickAdd(selectedItem, e); setSelectedItem(null); }}
                    className="btn-gold flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add Dish To Order (₹{selectedItem.price})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRMenu;
