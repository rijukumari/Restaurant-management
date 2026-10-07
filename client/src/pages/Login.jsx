import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('admin@lumiere.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If already logged in as admin, redirect directly to admin panel
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const noticeMessage = location.state?.message;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Strict Admin Only Check
    if (email.trim() === 'admin@lumiere.com' && password.trim() === 'admin123') {
      dispatch(setCredentials({
        user: { 
          id: '1', 
          name: 'Antoine Laurent', 
          email: 'admin@lumiere.com', 
          role: 'admin',
          title: 'General Manager & Executive Chef'
        },
        token: 'lumiere-secure-admin-jwt-token'
      }));
      
      toast.success('Welcome back, Admin! Opening Dashboard...', {
        icon: '👑',
        duration: 2500,
        style: {
          background: '#121212',
          color: '#F7F2E8',
          border: '1px solid #C6A15B'
        }
      });
      
      // Navigate directly to /admin immediately
      navigate('/admin', { replace: true });
    } else {
      setIsLoading(false);
      setErrorMsg('Access Denied: Invalid administrator credentials.');
      toast.error('Only authorized administrators can log in here.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F7F2E8] flex items-center justify-center p-4 pt-28 pb-16 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A15B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card-luxury p-8 sm:p-10 rounded-3xl relative z-10 border border-[#C6A15B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      >
        {/* Brand Crest */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C6A15B] flex items-center justify-center mb-4 bg-black/70 shadow-[0_0_20px_rgba(198,161,91,0.25)]">
            <ShieldCheck size={30} className="text-[#C6A15B]" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C6A15B] font-bold block mb-1">
            Restricted Staff Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Executive Admin Login</h1>
          <p className="text-gray-400 text-xs mt-1">Authorized Restaurant Management Only</p>
        </div>

        {/* Security Alert if redirected from /admin */}
        {noticeMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5"
          >
            <KeyRound size={16} className="shrink-0 text-amber-400" />
            <span>{noticeMessage}</span>
          </motion.div>
        )}

        {/* Error message if invalid credentials entered */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5"
          >
            <AlertTriangle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                placeholder="admin@lumiere.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
              Security Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Admin Auto-Fill Quick Helper */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center justify-between">
            <div>
              <span className="text-[#E2C98A] font-semibold block text-[11px]">Admin Credentials:</span>
              <span className="text-[11px] font-mono text-gray-300">admin@lumiere.com / admin123</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@lumiere.com');
                setPassword('admin123');
                toast.success('Admin credentials loaded!');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#C6A15B]/20 hover:bg-[#C6A15B]/30 text-[#E2C98A] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-gold w-full flex justify-center items-center gap-2 py-3.5 mt-6 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-pulse">Authorizing Administrator...</span>
            ) : (
              <>
                <span>Sign In To Admin Panel</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          <Link to="/" className="text-gray-400 hover:text-[#C6A15B] transition-colors">
            ← Return to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
