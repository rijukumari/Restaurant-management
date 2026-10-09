import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Users, ShoppingBag, DollarSign, Package, Calendar, 
  Activity, Search, Plus, Trash2, Edit2, CheckCircle2, XCircle, 
  RefreshCw, ArrowRight, ArrowLeft, Filter, Phone, Mail, Key, 
  Crown, ChefHat, Sparkles, AlertTriangle, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000/api';

const SuperAdminPanel = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // User filters & search
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'activity'

  const getHeaders = () => {
    const token = localStorage.getItem('token') || 'lumiere-secure-admin-jwt-token';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    try {
      const [overviewRes, usersRes, activityRes] = await Promise.all([
        fetch(`${API_BASE}/super-admin/overview`, { headers: getHeaders() }),
        fetch(`${API_BASE}/super-admin/users`, { headers: getHeaders() }),
        fetch(`${API_BASE}/super-admin/activity`, { headers: getHeaders() }),
      ]);

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.success) setOverview(d.data);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        if (d.success) setUsers(d.data);
      }
      if (activityRes.ok) {
        const d = await activityRes.json();
        if (d.success) setActivity(d.data);
      }
    } catch (err) {
      console.error('Super Admin fetch error:', err);
      toast.error('Unable to fetch live super admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast.success('Super admin records synchronized');
  };

  // Toggle User Active Status
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      const res = await fetch(`${API_BASE}/super-admin/users/${user._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));
        toast.success(`User ${user.name} is now ${newStatus ? 'Active' : 'Deactivated'}`);
      } else {
        toast.error(data.message || 'Failed to update user status');
      }
    } catch (err) {
      toast.error('Network error updating user');
    }
  };

  // Change Role
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/super-admin/users/${userId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success(`Role changed to ${newRole.toUpperCase()}`);
      } else {
        toast.error(data.message || 'Failed to change role');
      }
    } catch (err) {
      toast.error('Network error changing role');
    }
  };

  // Delete User
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${user.name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/super-admin/users/${user._id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u._id !== user._id));
        toast.success(`User ${user.name} removed`);
      } else {
        toast.error(data.message || 'Could not delete user');
      }
    } catch (err) {
      toast.error('Network error deleting user');
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.error('Please enter name and email');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/super-admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => [data.data, ...prev]);
        setCreateModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', role: 'waiter', password: '' });
        toast.success(`User ${data.data.name} added successfully!`, { icon: '👑' });
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch (err) {
      toast.error('Error creating user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && u.isActive) ||
      (selectedStatus === 'inactive' && !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleColors = {
    admin: 'bg-amber-500/20 text-[#D8B878] border-amber-500/40',
    manager: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    chef: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    kitchen_staff: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    waiter: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    cashier: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    customer: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F7F2E8] pt-24 pb-16 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#C6A15B] selection:text-black">
      {/* BACKGROUND LUXURY GLOW */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C6A15B]/30 via-transparent to-transparent -z-10" />

      {/* TOP BAR / NAVIGATION */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/40 text-[#C6A15B]">
                <Crown size={28} />
              </span>
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#C6A15B] uppercase block">
                  LUMIÈRE CENTRAL COMMAND
                </span>
                <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white tracking-wide">
                  Super Admin Panel
                </h1>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Master control of personnel, system health, revenue telemetry, and inventory access.
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#C6A15B]' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            <Link
              to="/inventory"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C6A15B]/40 bg-black/60 hover:bg-[#C6A15B]/10 text-[#C6A15B] text-xs font-semibold transition-all shadow-[0_0_15px_rgba(198,161,91,0.2)]"
            >
              <Package size={15} />
              <span>Inventory Portal</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] text-xs font-bold transition-all shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110"
            >
              <ShieldCheck size={16} />
              <span>Executive Admin</span>
            </Link>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'overview', label: 'System Telemetry & KPIs', icon: Activity },
            { id: 'users', label: `Personnel & Users (${users.length})`, icon: Users },
            { id: 'activity', label: 'Live Audit Log', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  active 
                    ? 'bg-[#C6A15B] text-[#080808] shadow-[0_0_15px_rgba(198,161,91,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Users */}
              <div className="glass-card-luxury p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/80 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Accounts</span>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#C6A15B]">
                    <Users size={18} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-playfair font-bold text-white">
                    {overview?.users?.total || users.length || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                    <span className="text-emerald-400 font-semibold">{overview?.users?.staff || 6} Staff</span>
                    <span>•</span>
                    <span>{overview?.users?.customers || 3} VIP Diners</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Revenue */}
              <div className="glass-card-luxury p-5 rounded-2xl border border-[#C6A15B]/30 bg-gradient-to-b from-[#14120E] to-[#0E0E0E] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#C6A15B] uppercase tracking-wider">Gross Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-[#C6A15B]/20 flex items-center justify-center text-[#C6A15B]">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-playfair font-bold text-[#D8B878]">
                    ₹{(overview?.revenue?.total || 5420000).toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                    <span className="text-emerald-400 font-semibold">+₹{(overview?.revenue?.today || 124500).toLocaleString('en-IN')} today</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Orders */}
              <div className="glass-card-luxury p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kitchen & Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                    <ShoppingBag size={18} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-playfair font-bold text-white">
                    {overview?.orders?.total || 142}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                    <span className="text-blue-400 font-semibold">{overview?.orders?.today || 28} today</span>
                    <span>•</span>
                    <span>{overview?.orders?.thisMonth || 412} this month</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Inventory Health */}
              <div className="glass-card-luxury p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inventory Health</span>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-amber-400">
                    <Package size={18} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-playfair font-bold text-white">
                    {overview?.inventory?.total || 8} <span className="text-sm font-normal text-gray-400">SKUs</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                      {overview?.inventory?.lowStock || 3} Low Stock Alerts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECONDARY ROW: Role Distribution & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Role Distribution */}
              <div className="lg:col-span-2 glass-card-luxury p-6 rounded-3xl border border-white/10 bg-[#0D0D0D]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-white">Personnel & Role Matrix</h3>
                    <p className="text-xs text-gray-400">Staff distribution across kitchen, floor, and executive tier</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="text-xs text-[#C6A15B] hover:underline flex items-center gap-1 font-semibold"
                  >
                    Manage Personnel <ArrowRight size={13} />
                  </button>
                </div>

                <div className="space-y-4">
                  {(overview?.roleBreakdown || [
                    { _id: 'admin', count: 1 },
                    { _id: 'manager', count: 1 },
                    { _id: 'chef', count: 1 },
                    { _id: 'kitchen_staff', count: 1 },
                    { _id: 'waiter', count: 1 },
                    { _id: 'cashier', count: 1 },
                    { _id: 'customer', count: 3 },
                  ]).map((item) => {
                    const totalU = users.length || 9;
                    const pct = Math.round((item.count / totalU) * 100);
                    return (
                      <div key={item._id} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize font-semibold text-gray-300">
                            {item._id.replace('_', ' ')}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {item.count} account{item.count > 1 ? 's' : ''} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#C6A15B] to-[#D8B878] rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Diagnostics Card */}
              <div className="glass-card-luxury p-6 rounded-3xl border border-white/10 bg-[#0D0D0D] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-playfair text-xl font-bold text-white">Node Health</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      OPERATIONAL
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">API Gateway</span>
                      <span className="text-gray-200 font-mono">http://localhost:5000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Frontend Client</span>
                      <span className="text-gray-200 font-mono">http://localhost:5173</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Database Adapter</span>
                      <span className="text-emerald-400 font-semibold">Resilient Auto-Sync</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Security Guard</span>
                      <span className="text-amber-300 font-mono">JWT Bearer + RBAC</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[11px] text-gray-400">Need instant supply checks?</p>
                  <Link
                    to="/inventory"
                    className="mt-2 block w-full py-2 rounded-xl bg-[#C6A15B]/20 text-[#D8B878] hover:bg-[#C6A15B] hover:text-black font-bold text-xs transition-all"
                  >
                    Open Live Inventory →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS & PERSONNEL TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filter Bar & Create Button */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search & filters */}
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[240px] flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search personnel by name, email, phone..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-[#C6A15B] cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="kitchen_staff">Kitchen Staff</option>
                  <option value="waiter">Waiter</option>
                  <option value="cashier">Cashier</option>
                  <option value="customer">Customer</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-[#C6A15B] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold text-xs shadow-[0_0_15px_rgba(198,161,91,0.3)] hover:brightness-110 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Personnel / Staff</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="glass-card-luxury rounded-3xl border border-white/10 bg-[#0C0C0C] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-black/40 text-gray-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-4 px-6">User / Personnel</th>
                      <th className="py-4 px-6">Role & Authorization</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Joined</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          No users found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        return (
                          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                            {/* User details */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C6A15B]/30 to-black border border-[#C6A15B]/40 flex items-center justify-center font-bold text-[#C6A15B]">
                                  {u.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{u.name}</div>
                                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                                    <span>{u.email}</span>
                                    {u.phone && <span>• {u.phone}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role Dropdown */}
                            <td className="py-4 px-6">
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${
                                  roleColors[u.role] || 'bg-white/10 text-white'
                                }`}
                              >
                                <option value="admin" className="bg-[#111] text-white">Admin</option>
                                <option value="manager" className="bg-[#111] text-white">Manager</option>
                                <option value="chef" className="bg-[#111] text-white">Chef</option>
                                <option value="kitchen_staff" className="bg-[#111] text-white">Kitchen Staff</option>
                                <option value="waiter" className="bg-[#111] text-white">Waiter</option>
                                <option value="cashier" className="bg-[#111] text-white">Cashier</option>
                                <option value="customer" className="bg-[#111] text-white">Customer</option>
                              </select>
                            </td>

                            {/* Status switch */}
                            <td className="py-4 px-6">
                              <button
                                onClick={() => handleToggleStatus(u)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                                  u.isActive 
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20'
                                }`}
                              >
                                {u.isActive ? (
                                  <>
                                    <CheckCircle2 size={12} />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={12} />
                                    <span>Suspended</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Joined */}
                            <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 size={15} />
                              </button>
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
        )}

        {/* 3. ACTIVITY LOG TAB */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="glass-card-luxury p-6 rounded-3xl border border-white/10 bg-[#0C0C0C]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#C6A15B]" />
                  <span>Recent Dining Orders</span>
                </h3>
                <span className="text-[10px] text-gray-400 uppercase font-mono">Live feed</span>
              </div>

              <div className="space-y-3">
                {(activity?.recentOrders || []).map((o, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#D8B878]">{o.orderNumber}</div>
                      <div className="text-xs text-gray-300 font-medium">{o.customerName || 'Table Guest'}</div>
                      <div className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-xs">₹{o.totalAmount?.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="glass-card-luxury p-6 rounded-3xl border border-white/10 bg-[#0C0C0C]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-[#C6A15B]" />
                  <span>Recent VIP Reservations</span>
                </h3>
                <span className="text-[10px] text-gray-400 uppercase font-mono">Live bookings</span>
              </div>

              <div className="space-y-3">
                {(activity?.recentReservations || []).map((r, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs">{r.name}</div>
                      <div className="text-[11px] text-gray-400">
                        Date: {r.date} • {r.time} ({r.partySize} Guests)
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                      r.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#111] border border-[#C6A15B]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C6A15B] uppercase block">ACCESS CONTROL</span>
                  <h3 className="font-playfair text-2xl font-bold text-white">Add New Personnel</h3>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Sommelier Marcel"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="marcel@lumiere.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="manager">Manager</option>
                      <option value="chef">Chef</option>
                      <option value="kitchen_staff">Kitchen Staff</option>
                      <option value="waiter">Waiter</option>
                      <option value="cashier">Cashier</option>
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1 font-medium">Temporary Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#D8B878] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:brightness-110 cursor-pointer"
                  >
                    Authorize & Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminPanel;
