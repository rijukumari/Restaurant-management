import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, AlertTriangle, Plus, Search, RefreshCw, Trash2, Edit3, 
  ArrowRight, ShieldCheck, CheckCircle2, TrendingDown, DollarSign, 
  Truck, ArrowUpRight, Crown, Layers, Box, RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Add Item Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    ingredient: '',
    quantity: '',
    unit: 'kg',
    minimumStock: 10,
    costPerUnit: 0,
    supplierName: '',
    supplierContact: '',
  });

  // Restock Modal
  const [restockModalItem, setRestockModalItem] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  // Edit Modal
  const [editModalItem, setEditModalItem] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem('token') || 'lumiere-secure-admin-jwt-token';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchInventory = async () => {
    try {
      const url = filterLowStock 
        ? `${API_BASE}/inventory?lowStock=true` 
        : `${API_BASE}/inventory`;
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const d = await res.json();
        if (d.success) setItems(d.data);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      toast.error('Unable to fetch inventory items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filterLowStock]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInventory();
    toast.success('Inventory records updated');
  };

  // Add New Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.ingredient || !newItem.quantity) {
      toast.error('Please enter ingredient name and quantity');
      return;
    }

    try {
      const payload = {
        ingredient: newItem.ingredient,
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        minimumStock: Number(newItem.minimumStock),
        costPerUnit: Number(newItem.costPerUnit),
        supplier: {
          name: newItem.supplierName,
          contact: newItem.supplierContact,
        },
      };

      const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => [data.data, ...prev]);
        setAddModalOpen(false);
        setNewItem({
          ingredient: '',
          quantity: '',
          unit: 'kg',
          minimumStock: 10,
          costPerUnit: 0,
          supplierName: '',
          supplierContact: '',
        });
        toast.success(`"${data.data.ingredient}" added to inventory vault`, { icon: '📦' });
      } else {
        toast.error(data.message || 'Failed to add item');
      }
    } catch (err) {
      toast.error('Network error creating inventory item');
    }
  };

  // Quick Restock Item
  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockModalItem || !restockQty || Number(restockQty) <= 0) {
      toast.error('Please enter a valid restock quantity');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/inventory/${restockModalItem._id}/restock`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity: Number(restockQty) }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(item => item._id === data.data._id ? data.data : item));
        toast.success(`Restocked ${restockModalItem.ingredient} (+${restockQty} ${restockModalItem.unit})!`, { icon: '✨' });
        setRestockModalItem(null);
        setRestockQty('');
      } else {
        toast.error(data.message || 'Failed to restock item');
      }
    } catch (err) {
      toast.error('Error during restock operation');
    }
  };

  // Update Item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editModalItem) return;

    try {
      const res = await fetch(`${API_BASE}/inventory/${editModalItem._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          ingredient: editModalItem.ingredient,
          quantity: Number(editModalItem.quantity),
          unit: editModalItem.unit,
          minimumStock: Number(editModalItem.minimumStock),
          costPerUnit: Number(editModalItem.costPerUnit),
          supplier: editModalItem.supplier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(item => item._id === data.data._id ? data.data : item));
        toast.success(`Updated ${data.data.ingredient} details`);
        setEditModalItem(null);
      } else {
        toast.error(data.message || 'Failed to update item');
      }
    } catch (err) {
      toast.error('Error updating inventory item');
    }
  };

  // Delete Item
  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Permanently remove "${item.ingredient}" from inventory records?`)) return;

    try {
      const res = await fetch(`${API_BASE}/inventory/${item._id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(i => i._id !== item._id));
        toast.success(`Removed ${item.ingredient} from stock`);
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting inventory item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.ingredient?.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const lowStockCount = items.filter(i => i.isLowStock || i.quantity <= i.minimumStock).length;
  const totalValuation = items.reduce((acc, i) => acc + (i.quantity * (i.costPerUnit || 0)), 0);

  return (
    <div className="min-h-screen bg-[#070707] text-[#F7F2E8] pt-24 pb-16 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#C6A15B] selection:text-black">
      {/* BACKGROUND LUXURY GLOW */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C6A15B]/30 via-transparent to-transparent -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/40 text-[#C6A15B]">
                <Package size={28} />
              </span>
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#C6A15B] uppercase block">
                  LUMIÈRE PANTRY & CELLAR
                </span>
                <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white tracking-wide">
                  Inventory Management
                </h1>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Live Michelin-grade ingredient telemetry, restock alerts, suppliers, and cellar valuations.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#C6A15B]' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync Vault'}</span>
            </button>

            <Link
              to="/super-admin"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C6A15B]/40 bg-black/60 hover:bg-[#C6A15B]/10 text-[#C6A15B] text-xs font-semibold transition-all shadow-[0_0_15px_rgba(198,161,91,0.2)]"
            >
              <Crown size={15} />
              <span>Super Admin Panel</span>
              <ArrowRight size={13} />
            </Link>

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] text-xs font-bold transition-all shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Stock Item</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Items */}
          <div className="glass-card-luxury p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stocked SKUs</span>
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#C6A15B]">
                <Box size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-playfair font-bold text-white">{items.length}</div>
              <p className="text-[11px] text-gray-400 mt-1">Culinary ingredients & fine wines</p>
            </div>
          </div>

          {/* 2. Low Stock Alerts */}
          <div className="glass-card-luxury p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#181308] to-[#0E0E0E]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Low Stock Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-playfair font-bold text-amber-300">{lowStockCount}</div>
              <p className="text-[11px] text-amber-400/80 mt-1">Requires immediate chef reorder</p>
            </div>
          </div>

          {/* 3. Valuation */}
          <div className="glass-card-luxury p-5 rounded-2xl border border-[#C6A15B]/30 bg-gradient-to-b from-[#14120E] to-[#0E0E0E]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#C6A15B] uppercase tracking-wider">Pantry Valuation</span>
              <div className="w-8 h-8 rounded-xl bg-[#C6A15B]/20 flex items-center justify-center text-[#C6A15B]">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-playfair font-bold text-[#D8B878]">
                ₹{totalValuation.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Aggregated cost of assets on hand</p>
            </div>
          </div>

          {/* 4. Cellar Operations */}
          <div className="glass-card-luxury p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stock Status</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-playfair font-bold text-emerald-400">
                {items.length > 0 ? `${Math.round(((items.length - lowStockCount) / items.length) * 100)}%` : '100%'}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Safe stock threshold ratio</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredient, vintage, or supplier..."
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterLowStock(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filterLowStock
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <AlertTriangle size={14} />
              <span>Show Low Stock Only ({lowStockCount})</span>
            </button>
          </div>
        </div>

        {/* INVENTORY TABLE / CARDS */}
        <div className="glass-card-luxury rounded-3xl border border-white/10 bg-[#0C0C0C] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Ingredient & Vintage</th>
                  <th className="py-4 px-6">Quantity In Stock</th>
                  <th className="py-4 px-6">Stock Health</th>
                  <th className="py-4 px-6">Unit Cost</th>
                  <th className="py-4 px-6">Supplier</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No stock items found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLow = item.isLowStock || item.quantity <= item.minimumStock;
                    const stockRatio = Math.min(100, Math.round((item.quantity / (item.minimumStock * 2 || 20)) * 100));

                    return (
                      <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Ingredient Name */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">{item.ingredient}</div>
                          <div className="text-[10px] text-gray-500">
                            Min Threshold: {item.minimumStock} {item.unit}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-6">
                          <span className={`text-base font-bold font-mono ${isLow ? 'text-amber-400' : 'text-white'}`}>
                            {item.quantity}
                          </span>
                          <span className="text-xs text-gray-400 ml-1 uppercase">{item.unit}</span>
                        </td>

                        {/* Stock Progress Bar */}
                        <td className="py-4 px-6 min-w-[160px]">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className={isLow ? 'text-amber-400 font-bold' : 'text-emerald-400 font-medium'}>
                              {isLow ? '⚠️ LOW STOCK' : '✓ ABUNDANT'}
                            </span>
                            <span className="text-gray-400 font-mono">{stockRatio}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                isLow ? 'bg-amber-500' : 'bg-emerald-400'
                              }`}
                              style={{ width: `${stockRatio}%` }}
                            />
                          </div>
                        </td>

                        {/* Cost */}
                        <td className="py-4 px-6 text-gray-300 font-mono">
                          ₹{item.costPerUnit?.toLocaleString('en-IN')} <span className="text-[10px] text-gray-500">/{item.unit}</span>
                        </td>

                        {/* Supplier */}
                        <td className="py-4 px-6">
                          <div className="text-gray-300 font-medium">{item.supplier?.name || 'Local Provisioner'}</div>
                          {item.supplier?.contact && (
                            <div className="text-[10px] text-gray-500">{item.supplier.contact}</div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Restock Button */}
                            <button
                              onClick={() => {
                                setRestockModalItem(item);
                                setRestockQty('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#C6A15B]/15 text-[#D8B878] hover:bg-[#C6A15B] hover:text-black font-semibold text-xs border border-[#C6A15B]/30 transition-all flex items-center gap-1 cursor-pointer"
                              title="Restock ingredient"
                            >
                              <RotateCcw size={12} />
                              <span>Restock</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => setEditModalItem({ ...item })}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit item"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#111] border border-[#C6A15B]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C6A15B] uppercase block">PANTRY VAULT</span>
                  <h3 className="font-playfair text-2xl font-bold text-white">Add Inventory SKU</h3>
                </div>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Ingredient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Périgord Black Truffle"
                    value={newItem.ingredient}
                    onChange={(e) => setNewItem({ ...newItem, ingredient: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Initial Quantity</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 5.5"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Unit</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="kg">kg (Kilograms)</option>
                      <option value="g">g (Grams)</option>
                      <option value="l">l (Liters)</option>
                      <option value="ml">ml (Milliliters)</option>
                      <option value="pcs">pcs (Pieces)</option>
                      <option value="dozen">dozen</option>
                      <option value="bunch">bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Min Threshold</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="10"
                      value={newItem.minimumStock}
                      onChange={(e) => setNewItem({ ...newItem, minimumStock: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Cost / Unit (₹)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 4500"
                      value={newItem.costPerUnit}
                      onChange={(e) => setNewItem({ ...newItem, costPerUnit: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Supplier Name</label>
                    <input
                      type="text"
                      placeholder="Supplier / Purveyor"
                      value={newItem.supplierName}
                      onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Supplier Contact</label>
                    <input
                      type="text"
                      placeholder="+91..."
                      value={newItem.supplierContact}
                      onChange={(e) => setNewItem({ ...newItem, supplierContact: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110 cursor-pointer"
                  >
                    Commit Stock to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESTOCK MODAL */}
      <AnimatePresence>
        {restockModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#111] border border-[#C6A15B]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C6A15B] uppercase block">RAPID RESTOCK</span>
                  <h3 className="font-playfair text-xl font-bold text-white">{restockModalItem.ingredient}</h3>
                </div>
                <button
                  onClick={() => setRestockModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-xs text-gray-300 mb-4">
                Current Level: <span className="font-bold font-mono text-[#D8B878]">{restockModalItem.quantity} {restockModalItem.unit}</span>
              </div>

              <form onSubmit={handleRestock} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">
                    Additional Quantity to Add ({restockModalItem.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 10"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110 cursor-pointer"
                >
                  Confirm Restock
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#111] border border-[#C6A15B]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C6A15B] uppercase block">EDIT RECORD</span>
                  <h3 className="font-playfair text-xl font-bold text-white">Modify Stock Details</h3>
                </div>
                <button
                  onClick={() => setEditModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Ingredient Name</label>
                  <input
                    type="text"
                    required
                    value={editModalItem.ingredient}
                    onChange={(e) => setEditModalItem({ ...editModalItem, ingredient: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Quantity</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editModalItem.quantity}
                      onChange={(e) => setEditModalItem({ ...editModalItem, quantity: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Unit</label>
                    <select
                      value={editModalItem.unit}
                      onChange={(e) => setEditModalItem({ ...editModalItem, unit: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="l">l</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                      <option value="dozen">dozen</option>
                      <option value="bunch">bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Min Threshold</label>
                    <input
                      type="number"
                      step="any"
                      value={editModalItem.minimumStock}
                      onChange={(e) => setEditModalItem({ ...editModalItem, minimumStock: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Cost / Unit (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={editModalItem.costPerUnit}
                      onChange={(e) => setEditModalItem({ ...editModalItem, costPerUnit: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110 cursor-pointer"
                >
                  Save Modifications
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
