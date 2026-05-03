import { useState } from 'react';
import { Mail, Lock, User, Chrome, LogIn, ArrowRight } from 'lucide-react';
import { signUp, signIn, signInWithGoogle, resetPassword } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        await signUp(name, email, password);
        setMessage('Account created successfully.');
      } else {
        await signIn(email, password);
        setMessage('Logged in successfully.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email first to reset your password.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] transition-colors duration-500 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 dark:bg-cyan-600/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.05] shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
      >
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-white/[0.05] text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
            <Lock size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 transition-colors">
            {mode === 'login'
              ? 'Enter your credentials to access your dashboard.'
              : 'Sign up to store your detection history and stats.'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6">
          
          {/* OAuth Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="group w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-200 font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-sm dark:shadow-none"
          >
            <Chrome size={18} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Animated Name Field (Only visible on signup) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <div className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a10] px-4 py-3 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                      required={mode === 'signup'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Email Address</label>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a10] px-4 py-3 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a10] px-4 py-3 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium tracking-widest"
                  required
                />
              </div>
            </div>

            {/* Feedback Banners */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400">
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-md dark:shadow-[0_0_20px_rgba(99,102,241,0.3)] mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
          
        {/* Footer Toggle */}
        <div className="p-6 bg-slate-50 dark:bg-[#0a0a10] border-t border-slate-100 dark:border-white/[0.05] text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setMessage('');
              }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {mode === 'login' ? 'Sign up here' : 'Log in here'}
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}