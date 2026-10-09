import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'admin@lumiere.com';
const ADMIN_PASSWORD = 'admin123';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ If already authenticated as admin → show dashboard directly
  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }

  // 🔒 Not authenticated → show login gate
  return <AdminLoginGate />;
};

const AdminLoginGate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password.trim() === ADMIN_PASSWORD
      ) {
        dispatch(
          setCredentials({
            user: {
              id: '1',
              name: 'Antoine Laurent',
              email: ADMIN_EMAIL,
              role: 'admin',
              title: 'General Manager & Executive Chef',
            },
            token: 'lumiere-secure-admin-jwt-token',
          })
        );
        toast.success('Welcome back, Admin! Access Granted...', {
          icon: '👑',
          duration: 2500,
          style: { background: '#121212', color: '#F7F2E8', border: '1px solid #C6A15B' },
        });
        navigate(location.pathname || '/admin', { replace: true });
      } else {
        setLoading(false);
        setErrorMsg('Access Denied: Invalid administrator credentials.');
        toast.error('Invalid admin credentials. Please try again.');
      }
    }, 600);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 14px 12px 42px',
    fontSize: '14px',
    color: '#F7F2E8',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070707',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
      color: '#F7F2E8',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(198,161,91,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(198,161,91,0.4)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            border: '2px solid #C6A15B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            background: 'rgba(0,0,0,0.6)',
            boxShadow: '0 0 24px rgba(198,161,91,0.25)',
          }}>
            <ShieldCheck size={32} color="#C6A15B" />
          </div>
          <div style={{
            fontSize: '10px', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#C6A15B',
            fontWeight: '700', marginBottom: '8px',
          }}>
            Restricted Access
          </div>
          <h1 style={{
            fontSize: '26px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '700', color: '#F7F2E8', margin: 0,
          }}>
            Executive Admin Portal
          </h1>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px', margin: '6px 0 0' }}>
            Authorized Restaurant Management Only
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px', marginBottom: '20px',
              fontSize: '12px', color: '#fca5a5',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, color: '#f87171' }} />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#aaa', marginBottom: '8px', fontWeight: '600',
            }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lumiere.com"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#C6A15B'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#aaa', marginBottom: '8px', fontWeight: '600',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '42px' }}
                onFocus={(e) => e.target.style.borderColor = '#C6A15B'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#666',
                  padding: 0, display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Hint box */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '11px', color: '#888',
          }}>
            <div>
              <div style={{ color: '#C6A15B', fontWeight: '700', marginBottom: '2px', fontSize: '11px' }}>Default Credentials:</div>
              <code style={{ color: '#ddd', fontSize: '11px' }}>admin@lumiere.com / admin123</code>
            </div>
            <button
              type="button"
              onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); toast.success('Credentials filled!'); }}
              style={{
                background: 'rgba(198,161,91,0.15)',
                border: '1px solid rgba(198,161,91,0.3)',
                borderRadius: '8px', padding: '6px 12px',
                color: '#C6A15B', fontSize: '10px', fontWeight: '700',
                cursor: 'pointer', textTransform: 'uppercase',
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Auto Fill
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', padding: '14px',
              background: loading ? 'rgba(198,161,91,0.4)' : 'linear-gradient(90deg, #C6A15B, #E2C98A, #C6A15B)',
              border: 'none', borderRadius: '12px',
              fontSize: '13px', fontWeight: '700',
              color: '#0A0A0A', textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 4px 20px rgba(198,161,91,0.3)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="/" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>
            ← Return to Dining Website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRoute;
