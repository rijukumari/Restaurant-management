import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, ChefHat, Bell, 
  LayoutDashboard, Utensils, QrCode, Calendar, Settings, Plus, 
  Trash2, CheckCircle, Clock, XCircle, Search, Filter, RefreshCw, 
  ArrowLeft, ArrowRight, Download, ShieldCheck, Star, ExternalLink, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

// Initial Mock Data for Rich Interactive Admin Experience
const initialOrders = [
  { 
    id: 'LUM-1045', 
    table: 'Table 4', 
    customer: 'Aarav Sharma', 
    items: [
      { name: 'Wagyu Beef Tenderloin', qty: 1, price: 4500 },
      { name: 'Smoked Old Fashioned', qty: 2, price: 950 }
    ], 
    status: 'Preparing', 
    time: '12 mins ago', 
    total: 6400,
    payment: 'Paid (Card)' 
  },
  { 
    id: 'LUM-1044', 
    table: 'Table 8', 
    customer: 'Priya Mehta', 
    items: [
      { name: 'Truffle Mushroom Bruschetta', qty: 2, price: 850 },
      { name: 'Lobster Bisque', qty: 2, price: 950 }
    ], 
    status: 'Ready', 
    time: '18 mins ago', 
    total: 3600,
    payment: 'Pending' 
  },
  { 
    id: 'LUM-1043', 
    table: 'Table 12', 
    customer: 'Vikramaditya Roy', 
    items: [
      { name: 'Pan-Seared Scallops', qty: 2, price: 1450 },
      { name: 'A5 Wagyu Tenderloin', qty: 1, price: 4500 },
      { name: 'Valrhona Chocolate Fondant', qty: 2, price: 850 }
    ], 
    status: 'Served', 
    time: '34 mins ago', 
    total: 9100,
    payment: 'Paid (UPI)' 
  },
  { 
    id: 'LUM-1042', 
    table: 'Table 2', 
    customer: 'Elena Rostova', 
    items: [
      { name: 'Oscietra Caviar Imperial', qty: 1, price: 1850 },
      { name: 'Château Margaux 2010', qty: 1, price: 8500 }
    ], 
    status: 'Completed', 
    time: '1 hr ago', 
    total: 10350,
    payment: 'Paid (Card)' 
  },
  { 
    id: 'LUM-1041', 
    table: 'Table 15 (Salon)', 
    customer: 'Devendra Singhania', 
    items: [
      { name: '8-Course Chef Degustation', qty: 4, price: 6500 }
    ], 
    status: 'Preparing', 
    time: '5 mins ago', 
    total: 26000,
    payment: 'Pre-authorized' 
  }
];

const initialMenuItems = [
  { id: '1', name: 'Truffle Mushroom Bruschetta', category: 'Starters', price: 850, isVeg: true, isBestseller: true, available: true, ordersCount: 142 },
  { id: '2', name: 'Wagyu Beef Tenderloin', category: 'Main Course', price: 4500, isVeg: false, isBestseller: true, available: true, ordersCount: 98 },
  { id: '3', name: 'Pan-Seared Scallops', category: 'Starters', price: 1450, isVeg: false, isBestseller: false, available: true, ordersCount: 65 },
  { id: '4', name: 'Lobster Bisque', category: 'Soups', price: 950, isVeg: false, isBestseller: false, available: true, ordersCount: 54 },
  { id: '5', name: 'Lamb Rogan Josh Royale', category: 'Main Course', price: 1450, isVeg: false, isBestseller: false, available: true, ordersCount: 88 },
  { id: '6', name: 'Valrhona Chocolate Fondant', category: 'Desserts', price: 850, isVeg: true, isBestseller: true, available: true, ordersCount: 210 },
  { id: '7', name: 'Smoked Old Fashioned', category: 'Beverages', price: 950, isVeg: true, isBestseller: true, available: true, ordersCount: 185 },
];

const initialTables = [
  { number: 1, seats: 2, section: 'Conservatory', status: 'Available', currentBill: 0, orderId: null },
  { number: 2, seats: 2, section: 'Window View', status: 'Occupied', currentBill: 10350, orderId: 'LUM-1042' },
  { number: 3, seats: 4, section: 'Main Hall', status: 'Available', currentBill: 0, orderId: null },
  { number: 4, seats: 4, section: 'Main Hall', status: 'Occupied', currentBill: 6400, orderId: 'LUM-1045' },
  { number: 5, seats: 2, section: 'Balcony', status: 'Reserved', currentBill: 0, orderId: null },
  { number: 6, seats: 6, section: 'Courtyard', status: 'Available', currentBill: 0, orderId: null },
  { number: 7, seats: 2, section: 'Quiet Nook', status: 'Available', currentBill: 0, orderId: null },
  { number: 8, seats: 4, section: 'Main Hall', status: 'Occupied', currentBill: 3600, orderId: 'LUM-1044' },
  { number: 9, seats: 2, section: 'Main Hall', status: 'Available', currentBill: 0, orderId: null },
  { number: 10, seats: 4, section: 'Wine Wall', status: 'Reserved', currentBill: 0, orderId: null },
  { number: 11, seats: 6, section: 'Center Fountain', status: 'Available', currentBill: 0, orderId: null },
  { number: 12, seats: 4, section: 'Main Hall', status: 'Occupied', currentBill: 9100, orderId: 'LUM-1043' },
  { number: 13, seats: 8, section: 'Chef Table', status: 'Available', currentBill: 0, orderId: null },
  { number: 14, seats: 8, section: 'Chef Table', status: 'Reserved', currentBill: 0, orderId: null },
  { number: 15, seats: 12, section: 'Private Salon', status: 'Occupied', currentBill: 26000, orderId: 'LUM-1041' },
];

const initialReservations = [
  { id: 'RES-901', name: 'Dr. Siddharth Kapoor', guests: 2, date: 'Today, 20:00', table: 'Table 5', service: 'Dinner Degustation', status: 'Confirmed', phone: '+91 98112 34567' },
  { id: 'RES-902', name: 'Ambassador Jean-Luc', guests: 4, date: 'Today, 20:30', table: 'Table 10', service: 'Sommelier Reserve', status: 'Confirmed', phone: '+91 98223 45678' },
  { id: 'RES-903', name: 'Ananya Birla', guests: 8, date: 'Today, 21:00', table: 'Table 14', service: 'Chef’s Counter (Live)', status: 'Pending VIP', phone: '+91 99334 56789' },
  { id: 'RES-904', name: 'Rajesh Mehra', guests: 2, date: 'Tomorrow, 19:30', table: 'Unassigned', service: 'Dinner Degustation', status: 'Pending', phone: '+91 97445 67890' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(initialOrders);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [tables, setTables] = useState(initialTables);
  const [reservations, setReservations] = useState(initialReservations);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  
  // New Dish Modal State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Starters',
    price: '',
    isVeg: true,
    isBestseller: false,
    description: ''
  });

  // Table QR Modal State
  const [selectedTableQR, setSelectedTableQR] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Order Management Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} status changed to ${newStatus}`);
  };

  // Menu Management Actions
  const handleToggleDishAvailability = (dishId) => {
    setMenuItems(prev => prev.map(item => item.id === dishId ? { ...item, available: !item.available } : item));
    toast.success('Dish availability updated');
  };

  const handleDeleteDish = (dishId) => {
    setMenuItems(prev => prev.filter(item => item.id !== dishId));
    toast.error('Dish removed from active repertoire');
  };

  const handleAddNewDish = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) {
      toast.error('Please enter dish name and price');
      return;
    }
    const createdItem = {
      id: Date.now().toString(),
      name: newDish.name,
      category: newDish.category,
      price: Number(newDish.price),
      isVeg: newDish.isVeg,
      isBestseller: newDish.isBestseller,
      available: true,
      ordersCount: 0
    };
    setMenuItems([createdItem, ...menuItems]);
    setShowAddDishModal(false);
    setNewDish({ name: '', category: 'Starters', price: '', isVeg: true, isBestseller: false, description: '' });
    toast.success(`${createdItem.name} added to menu!`, { icon: '🍽️' });
  };

  // Table Management Actions
  const handleToggleTableStatus = (tableNumber) => {
    setTables(prev => prev.map(t => {
      if (t.number === tableNumber) {
        const nextStatus = t.status === 'Available' ? 'Occupied' : t.status === 'Occupied' ? 'Reserved' : 'Available';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    toast.success(`Table ${tableNumber} status updated`);
  };

  // Reservation Actions
  const handleConfirmReservation = (resId) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'Confirmed' } : r));
    toast.success(`Reservation ${resId} confirmed`);
  };

  const handleCancelReservation = (resId) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'Cancelled' } : r));
    toast.error(`Reservation ${resId} cancelled`);
  };

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 45250;
  const activeTablesCount = tables.filter(t => t.status === 'Occupied').length;
  const preparingOrdersCount = orders.filter(o => o.status === 'Preparing').length;

  return (
    <div className="min-h-screen bg-[#070707] text-[#F7F2E8] flex flex-col md:flex-row">
      {/* 1. EXECUTIVE ADMIN SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#0C0C0C] border-r border-[#C6A15B]/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#C6A15B] flex items-center justify-center bg-black">
              <span className="font-playfair text-[#C6A15B] font-bold text-lg">L</span>
            </div>
            <div>
              <span className="font-playfair text-xl tracking-wider text-[#F7F2E8] font-bold block leading-none">LUMIÈRE</span>
              <span className="text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-semibold">Executive Portal</span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Live
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-4 space-y-1.5 flex-grow">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Live Orders & KDS', icon: ShoppingBag, badge: preparingOrdersCount },
            { id: 'menu', label: 'Menu Catalog', icon: Utensils, badge: menuItems.length },
            { id: 'tables', label: 'Tables & QR Setup', icon: QrCode },
            { id: 'reservations', label: 'VIP Reservations', icon: Calendar, badge: reservations.filter(r => r.status.includes('Pending')).length },
            { id: 'analytics', label: 'Financial Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Restaurant Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold shadow-[0_0_15px_rgba(198,161,91,0.3)]' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#080808] text-[#C6A15B]' : 'bg-[#C6A15B]/20 text-[#C6A15B]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Footer Links in Sidebar */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link 
            to="/kitchen" 
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
          >
            <ChefHat size={16} />
            <span>Open Kitchen Display</span>
          </Link>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Public Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 text-xs text-red-400 hover:text-red-300 transition-colors font-medium cursor-pointer"
          >
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <header className="h-18 px-6 md:px-10 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-playfair font-bold capitalize">
              {activeTab === 'dashboard' ? 'Executive Overview' : activeTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-gray-400">Lumière Haute Gastronomie · Admin Suite</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => toast.success('All restaurant systems synchronized with POS and KDS')}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Sync Data"
            >
              <RefreshCw size={18} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C6A15B] to-[#F3E5AB] text-black font-bold flex items-center justify-center text-sm">
                AL
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold leading-none">Antoine Laurent</p>
                <p className="text-[10px] text-[#C6A15B] uppercase font-semibold">General Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-6 md:p-10 space-y-10">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Today's Gross Sales", value: `₹${totalRevenue.toLocaleString()}`, trend: "+14.8% vs yesterday", icon: DollarSign, color: "text-[#C6A15B]" },
                  { title: "Live Orders Placed", value: orders.length + 132, trend: `${preparingOrdersCount} in active kitchen`, icon: ShoppingBag, color: "text-blue-400" },
                  { title: "Floor Capacity", value: `${activeTablesCount}/15 Tables`, trend: `${Math.round((activeTablesCount/15)*100)}% dining occupancy`, icon: Users, color: "text-emerald-400" },
                  { title: "VIP Covers Reserved", value: `${reservations.length * 3 + 18} Covers`, trend: "Fully booked tonight", icon: Calendar, color: "text-amber-400" },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="glass-card-luxury p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${s.color}`}>
                          <Icon size={22} />
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Live
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">{s.title}</p>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-[#F7F2E8] mb-2">{s.value}</h3>
                      <p className="text-xs text-gray-400">{s.trend}</p>
                    </div>
                  );
                })}
              </div>

              {/* Live Floor Summary & Quick Order Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active Tables Mini Map */}
                <div className="lg:col-span-7 glass-card-luxury p-6 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-playfair text-xl font-bold">Floor Seating Map</h3>
                      <p className="text-xs text-gray-400">Click table to toggle status</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('tables')}
                      className="text-xs text-[#C6A15B] font-semibold uppercase tracking-wider hover:underline"
                    >
                      Manage All 15 Tables →
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {tables.map(table => (
                      <button
                        key={table.number}
                        onClick={() => handleToggleTableStatus(table.number)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                          table.status === 'Occupied' 
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25' 
                            : table.status === 'Reserved'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        <p className="text-xs font-bold">T-{table.number}</p>
                        <p className="text-[10px] text-gray-400">{table.seats} seats</p>
                        <p className="text-[9px] uppercase tracking-wider font-semibold mt-1">{table.status}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-5 glass-card-luxury p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-playfair text-xl font-bold mb-4">Quick Operator Shortcuts</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => { setActiveTab('menu'); setShowAddDishModal(true); }}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-sm transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Plus size={16} className="text-[#C6A15B]" />
                          <span>Introduce New Menu Dish</span>
                        </div>
                        <ArrowRight size={14} className="text-gray-500" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-sm transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag size={16} className="text-blue-400" />
                          <span>Review Live Pending Kitchen Orders ({preparingOrdersCount})</span>
                        </div>
                        <ArrowRight size={14} className="text-gray-500" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('reservations')}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-sm transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-amber-400" />
                          <span>Confirm Tonight's VIP Bookings</span>
                        </div>
                        <ArrowRight size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#E2C98A]">Digital QR Dining Active</p>
                      <p className="text-[11px] text-gray-300">Guests can scan table QR code to view live menu & order</p>
                    </div>
                    <Link to="/menu/qr" className="px-3 py-1.5 rounded-lg bg-[#C6A15B] text-black font-bold text-xs">
                      Preview
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="glass-card-luxury rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-playfair text-xl font-bold">Recent Live Orders</h3>
                    <p className="text-xs text-gray-400">Streamed from mobile QR scans & in-house dining</p>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#C6A15B] font-semibold uppercase tracking-wider hover:underline">
                    View Full KDS Queue →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/60 text-[11px] uppercase tracking-wider text-gray-400 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Order #</th>
                        <th className="px-6 py-4">Table / Area</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Dishes</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.slice(0, 4).map(o => (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-[#E2C98A]">{o.id}</td>
                          <td className="px-6 py-4 font-semibold">{o.table}</td>
                          <td className="px-6 py-4 text-gray-300">{o.customer}</td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                          </td>
                          <td className="px-6 py-4 font-bold text-white">₹{o.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              o.status === 'Preparing' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              o.status === 'Ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              o.status === 'Served' ? 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/30' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleUpdateOrderStatus(o.id, o.status === 'Preparing' ? 'Ready' : o.status === 'Ready' ? 'Served' : 'Completed')}
                              className="text-xs text-[#C6A15B] hover:text-white font-medium hover:underline"
                            >
                              Advance Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LIVE ORDERS & KDS */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Filter Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {['All', 'Preparing', 'Ready', 'Served', 'Completed'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setOrderStatusFilter(filter)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                        orderStatusFilter === filter 
                          ? 'bg-[#C6A15B] text-black font-bold' 
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">{filteredOrders.length} orders displayed</p>
              </div>

              {/* Order Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                  <div key={order.id} className="glass-card-luxury p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#E2C98A]">{order.id}</span>
                          <h4 className="text-lg font-playfair font-bold text-white">{order.table}</h4>
                          <p className="text-xs text-gray-400">{order.customer} · {order.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'Preparing' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          order.status === 'Ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          order.status === 'Served' ? 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 py-3 border-y border-white/5">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-gray-300"><strong className="text-white">{it.qty}x</strong> {it.name}</span>
                            <span className="text-gray-400">₹{it.price * it.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 text-sm">
                        <span className="text-gray-400 text-xs">Payment: {order.payment}</span>
                        <span className="font-bold text-base text-[#E2C98A]">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Status Advance Controls */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-colors ${order.status === 'Preparing' ? 'bg-orange-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                      >
                        Kitchen
                      </button>
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Ready')}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-colors ${order.status === 'Ready' ? 'bg-blue-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                      >
                        Ready
                      </button>
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-colors ${order.status === 'Completed' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: MENU MANAGEMENT */}
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-playfair text-2xl font-bold">Lumière Haute Gastronomie Menu Catalog</h3>
                  <p className="text-xs text-gray-400">Control active dishes, pricing, signature badges, and live table availability</p>
                </div>
                <button 
                  onClick={() => setShowAddDishModal(true)}
                  className="btn-gold flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(198,161,91,0.4)]"
                >
                  <Plus size={16} />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Menu Table */}
              <div className="glass-card-luxury rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/60 text-[11px] uppercase tracking-wider text-gray-400 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Dish Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {menuItems.map(dish => (
                        <tr key={dish.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <span>{dish.name}</span>
                              {dish.isBestseller && (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-[#C6A15B]/20 text-[#C6A15B] font-bold">
                                  Signature
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{dish.category}</td>
                          <td className="px-6 py-4 font-mono font-bold text-[#E2C98A]">₹{dish.price}</td>
                          <td className="px-6 py-4">
                            {dish.isVeg ? (
                              <span className="text-emerald-400 text-xs font-semibold">● Veg</span>
                            ) : (
                              <span className="text-rose-400 text-xs font-semibold">● Non-Veg</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleDishAvailability(dish.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                dish.available ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              {dish.available ? 'Active in Menu' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteDish(dish.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete Dish"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: TABLE & QR MANAGER */}
          {activeTab === 'tables' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-playfair text-2xl font-bold">Tables & QR Code Deployment</h3>
                  <p className="text-xs text-gray-400">Generate, view, and test digital ordering QR codes for all 15 dining tables</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ● Green: Available
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    ● Red: Occupied
                  </span>
                </div>
              </div>

              {/* Table Grid with QR Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tables.map(table => (
                  <div key={table.number} className="glass-card-luxury p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-playfair text-2xl font-bold text-white">Table {table.number}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          table.status === 'Occupied' ? 'bg-rose-500/20 text-rose-400' :
                          table.status === 'Reserved' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {table.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{table.section} · {table.seats} Seats</p>
                      {table.currentBill > 0 && (
                        <p className="text-xs text-[#E2C98A] font-bold mt-2">Active: ₹{table.currentBill.toLocaleString()}</p>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setSelectedTableQR(table)}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-[#C6A15B] hover:text-black border border-white/10 flex items-center justify-center gap-2 text-xs font-bold transition-all"
                      >
                        <QrCode size={14} />
                        <span>View / Print QR</span>
                      </button>
                      <button
                        onClick={() => handleToggleTableStatus(table.number)}
                        className="w-full py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-white transition-colors"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-playfair text-2xl font-bold">VIP & Table Reservations</h3>
                <p className="text-xs text-gray-400">Review upcoming guest seatings, tasting course requests, and special dietary notes</p>
              </div>

              <div className="glass-card-luxury rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/60 text-[11px] uppercase tracking-wider text-gray-400 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Booking ID</th>
                        <th className="px-6 py-4">Guest Name</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Covers</th>
                        <th className="px-6 py-4">Experience</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reservations.map(res => (
                        <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-[#E2C98A]">{res.id}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white">{res.name}</p>
                            <p className="text-xs text-gray-400">{res.phone}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{res.date}</td>
                          <td className="px-6 py-4 font-bold">{res.guests} Guests</td>
                          <td className="px-6 py-4 text-xs text-[#C6A15B]">{res.service}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              res.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              res.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {res.status !== 'Confirmed' && (
                              <button 
                                onClick={() => handleConfirmReservation(res.id)}
                                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg text-xs font-bold transition-all"
                              >
                                Confirm
                              </button>
                            )}
                            {res.status !== 'Cancelled' && (
                              <button 
                                onClick={() => handleCancelReservation(res.id)}
                                className="px-3 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-black rounded-lg text-xs font-bold transition-all"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h3 className="font-playfair text-2xl font-bold">Revenue & Operational Metrics</h3>
                <p className="text-xs text-gray-400">Financial breakdown for the current service week</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-luxury p-6 rounded-2xl border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Average Table Spend</p>
                  <h4 className="text-3xl font-playfair font-bold text-[#E2C98A]">₹7,450</h4>
                  <p className="text-xs text-emerald-400 mt-2">+8.4% compared to last cycle</p>
                </div>
                <div className="glass-card-luxury p-6 rounded-2xl border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Top Grossing Category</p>
                  <h4 className="text-3xl font-playfair font-bold text-white">Main Course</h4>
                  <p className="text-xs text-gray-400 mt-2">A5 Wagyu accounts for 44% of entree volume</p>
                </div>
                <div className="glass-card-luxury p-6 rounded-2xl border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Sommelier Cellar Share</p>
                  <h4 className="text-3xl font-playfair font-bold text-[#C6A15B]">36.2%</h4>
                  <p className="text-xs text-gray-400 mt-2">Wine pairings purchased on 78% of tasting menus</p>
                </div>
              </div>

              {/* Weekly Performance Bar Graphic */}
              <div className="glass-card-luxury p-8 rounded-2xl border border-white/10">
                <h4 className="font-playfair text-xl font-bold mb-6">Weekly Revenue Distribution (₹ in Thousands)</h4>
                <div className="grid grid-cols-7 gap-4 items-end h-48 pt-6 border-b border-white/10 pb-4">
                  {[
                    { day: 'Mon', rev: 52 },
                    { day: 'Tue', rev: 68 },
                    { day: 'Wed', rev: 84 },
                    { day: 'Thu', rev: 92 },
                    { day: 'Fri', rev: 145 },
                    { day: 'Sat', rev: 180 },
                    { day: 'Sun', rev: 165 },
                  ].map(b => (
                    <div key={b.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-xs text-[#E2C98A] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{b.rev}k
                      </span>
                      <div 
                        className="w-full max-w-[42px] bg-gradient-to-t from-[#C6A15B] to-[#F3E5AB] rounded-t-lg transition-all duration-500 hover:brightness-125"
                        style={{ height: `${(b.rev / 180) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-400 font-medium">{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-playfair text-2xl font-bold">Restaurant Configuration</h3>
                <p className="text-xs text-gray-400">Establish operational timings, tax structures, and concierge contact information</p>
              </div>

              <div className="glass-card-luxury p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">Restaurant Name</label>
                    <input type="text" readOnly value="LUMIÈRE Haute Gastronomie" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">Service Currency</label>
                    <input type="text" readOnly value="INR (₹)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">GST / Tax Structure (%)</label>
                    <input type="number" defaultValue="5" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">Service Charge (%)</label>
                    <input type="number" defaultValue="10" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">Concierge Phone Line</label>
                    <input type="text" defaultValue="+91 11 4567 8900" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-2">Active Floor Tables</label>
                    <input type="number" defaultValue="15" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]" />
                  </div>
                </div>

                <button 
                  onClick={() => toast.success('Settings saved to database!')}
                  className="btn-gold cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* 3. MODAL: ADD NEW DISH */}
      <AnimatePresence>
        {showAddDishModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-luxury p-8 rounded-3xl border border-[#C6A15B]/40 max-w-lg w-full space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-playfair text-2xl font-bold">Add Culinary Dish</h3>
                <button onClick={() => setShowAddDishModal(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewDish} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Dish Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Foie Gras Poêlé"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Category</label>
                    <select 
                      value={newDish.category}
                      onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Soups">Soups</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1650"
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={newDish.isVeg}
                      onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                      className="rounded accent-[#C6A15B]"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={newDish.isBestseller}
                      onChange={(e) => setNewDish({ ...newDish, isBestseller: e.target.checked })}
                      className="rounded accent-[#C6A15B]"
                    />
                    <span>Signature Dish</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setShowAddDishModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-gold cursor-pointer"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: TABLE QR CODE & PRINT VIEW */}
      <AnimatePresence>
        {selectedTableQR && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-luxury p-8 rounded-3xl border border-[#C6A15B]/40 max-w-sm w-full text-center space-y-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">LUMIÈRE SMART QR</span>
                <button onClick={() => setSelectedTableQR(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              {/* Printable Table QR Card */}
              <div className="p-6 rounded-2xl bg-white text-black space-y-4 shadow-2xl">
                <div>
                  <h4 className="font-playfair text-2xl font-bold tracking-wider">LUMIÈRE</h4>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600 font-semibold">Table {selectedTableQR.number} · {selectedTableQR.section}</p>
                </div>

                <div className="w-48 h-48 mx-auto bg-gray-100 p-2 rounded-xl border-2 border-black flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`http://localhost:5173/menu/table/${selectedTableQR.number}`)}`} 
                    alt={`QR for Table ${selectedTableQR.number}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  Scan to browse live menu, place orders directly & request sommelier
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    toast.success(`QR Card for Table ${selectedTableQR.number} sent to printer!`);
                    setSelectedTableQR(null);
                  }}
                  className="btn-gold w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Print Table Standee</span>
                </button>
                <Link
                  to={`/menu/table/${selectedTableQR.number}`}
                  target="_blank"
                  className="btn-outline-gold w-full flex items-center justify-center gap-2 text-xs"
                >
                  <ExternalLink size={14} />
                  <span>Test Mobile Menu Link</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
