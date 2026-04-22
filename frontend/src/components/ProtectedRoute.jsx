import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] transition-colors duration-500">
        <div className="flex flex-col items-center justify-center relative">
          
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[50px] rounded-full animate-pulse pointer-events-none" />
          
          {/* Animated Scanner Box */}
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center mb-6 overflow-hidden">
            <ScanLine size={32} className="text-indigo-500 dark:text-indigo-400 opacity-50" />
            
            {/* Infinite Laser Sweep */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>

          {/* Status Text & Dots */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
              Verifying Session
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!user) return <Navigate to="/auth" replace />;

  // Render the protected component
  return children;
}