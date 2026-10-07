import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Dummy initial orders
const initialOrders = [
  { id: 'LUM-1045', table: '4', items: [{ name: 'Wagyu Beef Tenderloin', qty: 1, notes: 'Medium Rare' }, { name: 'Truffle Mushroom Bruschetta', qty: 2 }], status: 'Pending', time: 'Just now' },
  { id: 'LUM-1046', table: '12', items: [{ name: 'Lobster Bisque', qty: 2 }, { name: 'Pan-Seared Scallops', qty: 1 }], status: 'Pending', time: '2 mins ago' },
  { id: 'LUM-1042', table: 'Takeaway', items: [{ name: 'Thai Green Curry', qty: 2 }, { name: 'Jasmine Rice', qty: 2 }], status: 'Preparing', time: '10 mins ago' },
];

const KitchenDashboard = () => {
  const [orders, setOrders] = useState(initialOrders);

  // Simulated Socket.IO live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate a new order arriving every 30 seconds
      if (Math.random() > 0.7 && orders.length < 8) {
        const newOrder = {
          id: `LUM-${Math.floor(1000 + Math.random() * 9000)}`,
          table: Math.floor(1 + Math.random() * 15).toString(),
          items: [{ name: 'Chef Special Reserve', qty: 1, notes: 'Extra sauce' }],
          status: 'Pending',
          time: 'Just now'
        };
        setOrders(prev => [newOrder, ...prev]);
        toast('New Order Received!', { icon: '🔔', style: { background: '#C6A15B', color: '#000' }});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [orders]);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} marked as ${newStatus}`);
    
    // Auto-remove ready orders after 3 seconds for demo purposes
    if (newStatus === 'Ready') {
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== id));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F2E8] p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-playfair flex items-center gap-3">
            <ChefHat size={32} className="text-[#C6A15B]" /> Kitchen Display System
          </h1>
          <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Sync Active
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#111] px-4 py-2 rounded-lg border border-white/10 text-center">
            <p className="text-xs text-gray-500 uppercase">Pending</p>
            <p className="text-xl font-bold text-orange-500">{orders.filter(o => o.status === 'Pending').length}</p>
          </div>
          <div className="bg-[#111] px-4 py-2 rounded-lg border border-white/10 text-center">
            <p className="text-xs text-gray-500 uppercase">Preparing</p>
            <p className="text-xl font-bold text-blue-500">{orders.filter(o => o.status === 'Preparing').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-[#0F0F0F] rounded-2xl overflow-hidden border-2 flex flex-col ${
                order.status === 'Pending' ? 'border-orange-500/30' :
                order.status === 'Preparing' ? 'border-blue-500/30' :
                'border-green-500/30'
              }`}
            >
              {/* Header */}
              <div className={`p-4 flex justify-between items-center ${
                order.status === 'Pending' ? 'bg-orange-500/10' :
                order.status === 'Preparing' ? 'bg-blue-500/10' :
                'bg-green-500/10'
              }`}>
                <div>
                  <h3 className="font-bold text-lg">{order.id}</h3>
                  <p className="text-xs flex items-center gap-1 opacity-80"><Clock size={12} /> {order.time}</p>
                </div>
                <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/10 text-center">
                  <p className="text-[10px] uppercase text-gray-400">Table</p>
                  <p className="font-bold text-lg leading-none">{order.table}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex-grow space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <span className="font-bold text-[#C6A15B] text-lg leading-none">{item.qty}x</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-orange-400 mt-1 flex items-start gap-1">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" /> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-4 bg-[#151515] mt-auto">
                {order.status === 'Pending' && (
                  <button onClick={() => updateStatus(order.id, 'Preparing')} className="w-full py-3 rounded-xl bg-orange-500/20 text-orange-500 font-bold hover:bg-orange-500 text-white transition-colors">
                    Start Preparing
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button onClick={() => updateStatus(order.id, 'Ready')} className="w-full py-3 rounded-xl bg-blue-500/20 text-blue-500 font-bold hover:bg-blue-500 text-white transition-colors flex justify-center items-center gap-2">
                    <CheckCircle2 size={18} /> Mark Ready
                  </button>
                )}
                {order.status === 'Ready' && (
                  <div className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold text-center">
                    Ready for Service
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
            <CheckCircle2 size={64} className="mb-4 text-green-500" />
            <h2 className="text-2xl font-playfair">All caught up!</h2>
            <p>No active orders in the kitchen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDashboard;
