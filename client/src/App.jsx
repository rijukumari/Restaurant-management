import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Menu from './pages/Menu'
import QRMenu from './pages/QRMenu'
import Story from './pages/Story'
import Experience from './pages/Experience'
import Reservation from './pages/Reservation'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import KitchenDashboard from './pages/KitchenDashboard'
import SuperAdminPanel from './pages/SuperAdminPanel'
import Inventory from './pages/Inventory'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/qr" element={<QRMenu />} />
          <Route path="/menu/table/:tableNumber" element={<QRMenu />} />
          <Route path="/story" element={<Story />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/success/:id" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          
          {/* Full Stack Super Admin & Inventory (with Navbar & Footer) */}
          <Route path="/super-admin" element={<AdminRoute><SuperAdminPanel /></AdminRoute>} />
          <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
        </Route>
        
        {/* Admin/Staff Routes - Protected by AdminRoute gate */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/super-admin" element={<AdminRoute><SuperAdminPanel /></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/kitchen" element={<KitchenDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

