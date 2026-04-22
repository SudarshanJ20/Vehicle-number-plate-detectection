import { NavLink } from 'react-router-dom';
import { ScanLine, History, BarChart2, Info, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { to: '/', label: 'Detect', icon: ScanLine },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Analytics', icon: BarChart2 },
  { to: '/about', label: 'About', icon: Info }
];

export default function Layout({ children, dark, setDark }) {
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col ${dark ? 'bg-[#09090b] text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Global Ambient Background Glows (Fixed so they persist across pages) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none z-0" />

      {/* ================= DESKTOP & TABLET HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.05] transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
              <ScanLine size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white transition-colors">
              Plate<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink 
                key={to} 
                to={to} 
                end={to === '/'}
                className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm dark:shadow-none' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            
            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2 transition-colors duration-500" />

            {/* Animated Theme Toggle */}
            <button 
              onClick={() => setDark(d => !d)} 
              className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 bg-slate-100 hover:bg-slate-200 text-amber-500 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:text-indigo-400 border border-transparent dark:border-white/[0.05]"
              aria-label="Toggle Dark Mode"
            >
              <motion.div
                initial={false}
                animate={{ rotate: dark ? -90 : 0, scale: dark ? 0 : 1, opacity: dark ? 0 : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
              >
                <Sun size={18} />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ rotate: dark ? 0 : 90, scale: dark ? 1 : 0, opacity: dark ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
              >
                <Moon size={18} />
              </motion.div>
            </button>
          </nav>

          {/* Mobile Theme Toggle (Visible only on small screens) */}
          <button 
            onClick={() => setDark(d => !d)} 
            className="md:hidden p-2 rounded-lg bg-slate-100 text-amber-500 dark:bg-white/[0.05] dark:text-indigo-400 transition-colors"
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      {/* z-10 ensures it sits above the background glows. 
          pb-24 accounts for the mobile navigation bar at the bottom. */}
      <main className="relative z-10 flex-1 w-full pb-24 md:pb-6">
        {children}
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.05] pb-safe transition-colors duration-500">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to === '/'}
              className={({ isActive }) => `flex-1 flex flex-col items-center justify-center gap-1.5 h-full transition-all duration-300 ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {({ isActive }) => (
                <>
                  {/* Subtle active indicator pill */}
                  <motion.div 
                    animate={{ y: isActive ? -2 : 0 }} 
                    className={`p-1.5 rounded-full ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-transparent'}`}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

    </div>
  );
}