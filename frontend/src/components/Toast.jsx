import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

// Centralized configuration for easy scaling
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    styles: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    styles: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    styles: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    icon: Info,
    styles: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
  }
};

export default function Toast({ msg, type = 'info', onClose }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout // Allows smooth sorting if multiple toasts are stacked
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex items-start sm:items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-colors duration-300 w-full sm:w-auto max-w-sm ${config.styles}`}
      role="alert"
    >
      <Icon size={18} className={`shrink-0 mt-0.5 sm:mt-0 ${config.iconColor}`} />
      
      <span className="text-sm font-semibold flex-1 mr-2 leading-snug">
        {msg}
      </span>
      
      <button 
        onClick={onClose} 
        className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}