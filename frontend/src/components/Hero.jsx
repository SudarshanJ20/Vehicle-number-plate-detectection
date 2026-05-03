// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { Play, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              YOLO11 Powered ANPR Engine
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.95]"
          >
            Intelligence for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
              Indian Roads
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12"
          >
            A high-performance Automatic Number Plate Recognition system designed for high-speed traffic, low-light conditions, and diverse Indian plate formats.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              to="/detect" 
              className="group flex items-center gap-2 bg-slate-900 dark:bg-indigo-500 hover:bg-slate-800 dark:hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl dark:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              Launch Scanner <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works" 
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              <Play size={16} fill="currentColor" /> Watch Logic
            </a>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 border-t border-slate-200 dark:border-white/[0.05] pt-12"
          >
            <div className="text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-2 text-2xl font-black text-slate-900 dark:text-white">
                <Zap size={20} className="text-indigo-500" /> &lt;80ms
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Inference Latency</p>
            </div>
            <div className="text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-2 text-2xl font-black text-slate-900 dark:text-white">
                <ShieldCheck size={20} className="text-cyan-500" /> 94%
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Detection Accuracy</p>
            </div>
            <div className="text-center md:text-left col-span-2 md:col-span-1">
              <p className="text-2xl font-black text-slate-900 dark:text-white">YOLO11</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Latest SOTA Model</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}