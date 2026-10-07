import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Leaf, ShoppingBag, Search, Plus, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const mockMenu = [
  { _id: '1', name: 'Truffle Mushroom Bruschetta', description: 'Crispy artisan bread topped with wild mushroom duxelles, truffle oil, and aged Parmesan shavings', price: 850, category: 'Starters', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600' },
  { _id: '2', name: 'Wagyu Beef Tenderloin', description: 'A5 Wagyu beef with black truffle jus, potato gratin, and seasonal vegetables', price: 4500, category: 'Main Course', isVeg: false, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600' },
  { _id: '3', name: 'Lobster Bisque', description: 'Velvety lobster bisque finished with cognac cream', price: 950, category: 'Soups', isVeg: false, spiceLevel: 'mild', isBestseller: false, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600' },
  { _id: '4', name: 'Lamb Rogan Josh', description: 'Tender lamb shanks in aromatic Kashmiri spice gravy', price: 1450, category: 'Main Course', isVeg: false, spiceLevel: 'hot', isBestseller: false, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600' },
  { _id: '5', name: 'Valrhona Chocolate Fondant', description: 'Molten Valrhona dark chocolate with vanilla bean ice cream', price: 850, category: 'Desserts', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' },
  { _id: '6', name: 'Smoked Old Fashioned', description: 'Premium bourbon with smoked maple and orange zest', price: 950, category: 'Beverages', isVeg: true, spiceLevel: 'mild', isBestseller: true, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600' },
];

const categories = ['All', 'Starters', 'Soups', 'Main Course', 'Desserts', 'Beverages'];

const Menu = () => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    }));

    setAddedItems((prev) => ({ ...prev, [item._id]: true }));
    toast.success(`${item.name} added to cart!`, { icon: '🛍️' });

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  const filteredMenu = mockMenu.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-[#F7F2E8] pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.3em] text-[#C6A15B] uppercase mb-4">Discover Flavors</h2>
          <h1 className="text-4xl md:text-6xl font-playfair mb-8">Our Culinary Repertoire</h1>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-10">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search dishes, ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-3 pl-12 pr-4 focus:outline-none focus:border-[#C6A15B] transition-colors text-white placeholder-gray-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeCategory === cat ? 'bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B]' : 'bg-transparent border border-white/20 hover:border-[#C6A15B] text-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredMenu.map((item, index) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-panel group rounded-2xl overflow-hidden hover:border-[#C6A15B]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="h-60 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10 duration-500"></div>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    {item.isBestseller && (
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#C6A15B]/30 flex items-center gap-2">
                        <Flame size={14} className="text-[#C6A15B]" />
                        <span className="text-xs uppercase font-bold text-[#C6A15B] tracking-wider">Signature</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-playfair text-2xl group-hover:text-[#C6A15B] transition-colors line-clamp-1">{item.name}</h3>
                      <span className="text-xl font-medium text-[#C6A15B] ml-4">₹{item.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">{item.description}</p>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex justify-between items-center border-t border-white/10 pt-6">
                    <div className="flex gap-3">
                      {item.isVeg ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                          <Leaf size={12} /> Veg
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div> Non-Veg
                        </span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${addedItems[item._id] ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#0B0B0B] hover:shadow-[0_0_15px_rgba(198,161,91,0.5)] transform hover:-translate-y-0.5'}`}
                    >
                      {addedItems[item._id] ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Menu;
