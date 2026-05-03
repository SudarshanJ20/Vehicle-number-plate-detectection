import { useState, useEffect, useMemo } from 'react';
import { History, Search, MapPin, Car, Clock, Activity, ShieldCheck, Database, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserDetections } from '../firebase/detections';

export default function HistoryPage() {
  const { user } = useAuth();
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    getUserDetections(user.uid)
      .then(data => {
        setDetections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const types = ['all', ...new Set(detections.map(r => r.plateType).filter(Boolean))];

  const filtered = useMemo(() => detections.filter(r => {
    const matchSearch =
      r.plateText?.toLowerCase().includes(search.toLowerCase()) ||
      r.state?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.plateType === filter;
    return matchSearch && matchFilter;
  }), [detections, search, filter]);

  // Derived KPI Stats
  const stats = useMemo(() => {
    if (!detections.length) return null;
    const highAcc = detections.filter(d => (d.ocrConfidence || 0) > 85).length;
    const uniqueStates = new Set(detections.map(d => d.state).filter(Boolean)).size;
    return {
      total: detections.length,
      accuracyRate: Math.round((highAcc / detections.length) * 100) || 0,
      states: uniqueStates
    };
  }, [detections]);

  // Theme-aware color helper
  const confColor = (v) => {
    const val = parseFloat(v) || 0;
    if (val >= 85) return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-500/30', fill: 'bg-emerald-50 dark:bg-emerald-500/10' };
    if (val >= 65) return { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-200 dark:border-indigo-500/30', fill: 'bg-indigo-50 dark:bg-indigo-500/10' };
    return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-500/30', fill: 'bg-amber-50 dark:bg-amber-500/10' };
  };

  return (
    <div className="text-slate-700 dark:text-slate-300 font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      
      <div className="max-w-[1600px] mx-auto px-6 py-10 md:p-12 relative z-10 space-y-8 min-h-[calc(100vh-64px)]">

        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4 transition-colors">
              <Database size={12} /> Data Ledger
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Detection Logs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Historical database of all localized and recognized vehicle plates.</p>
          </motion.div>

          {/* KPI Mini-Cards */}
          {!loading && stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { label: 'Total Scans', value: stats.total, icon: Activity, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-500/10' },
                { label: 'High Accuracy', value: `${stats.accuracyRate}%`, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
                { label: 'States Logged', value: stats.states, icon: MapPin, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/10' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-md transition-all">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors">{stat.label}</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors">{stat.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        {!loading && detections.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-2 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl flex flex-col sm:flex-row gap-2 transition-all"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by plate number, state..."
                className="w-full pl-11 pr-4 py-3 text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-0"
              />
            </div>
            
            <div className="hidden sm:block w-px bg-slate-200 dark:bg-white/10 my-2 mx-2 transition-colors" />
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 px-2 sm:px-0">
              <Filter size={14} className="text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
              {types.map(t => (
                <button 
                  key={t} 
                  onClick={() => setFilter(t)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === t
                      ? 'bg-indigo-600 text-white shadow-lg dark:bg-indigo-500 dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="relative">
          {/* Skeleton Loader */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] animate-pulse flex items-center px-6 gap-6 shadow-sm">
                  <div className="w-32 h-8 bg-slate-100 dark:bg-white/5 rounded-lg" />
                  <div className="flex gap-2"><div className="w-16 h-5 bg-slate-100 dark:bg-white/5 rounded-full" /></div>
                  <div className="flex-1" />
                  <div className="w-24 h-6 bg-slate-100 dark:bg-white/5 rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-[#161625] border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                <History size={32} className="text-slate-400 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No records found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {detections.length > 0 
                  ? 'No results match your current filter or search.' 
                  : 'Your scan history is empty. Head to the scanner to begin.'}
              </p>
            </motion.div>
          )}

          {/* Data List */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((r, i) => {
                  const detConf = confColor(r.detectionConfidence);
                  const ocrConf = confColor(r.ocrConfidence);

                  return (
                    <motion.div 
                      key={r.id || i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                      className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:p-5 rounded-2xl bg-white dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm dark:shadow-none transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-[#0a0a13] border border-slate-200 dark:border-white/5 shadow-inner">
                          <p className="font-mono text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-[0.15em] group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                            {r.plateText}
                          </p>
                        </div>
                        
                        <div className="space-y-2 hidden sm:block">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                              <MapPin size={10} className="text-indigo-500" /> {r.state || 'Unknown'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                              <Car size={10} className="text-cyan-500" /> {r.plateType || 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                            <Clock size={10} />
                            {r.createdAt instanceof Date 
                              ? r.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                              : 'Timestamp unavailable'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row gap-4 sm:ml-auto">
                        {/* Detection Bar */}
                        <div className={`flex flex-col justify-center px-4 py-2 rounded-xl border transition-colors ${detConf.fill} ${detConf.border} min-w-[120px]`}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">Detection</span>
                            <span className={`text-xs font-mono font-bold ${detConf.text}`}>{(r.detectionConfidence ?? 0).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                            <div className={`h-full ${detConf.bg} rounded-full`} style={{ width: `${r.detectionConfidence || 0}%` }} />
                          </div>
                        </div>

                        {/* OCR Bar */}
                        <div className={`flex flex-col justify-center px-4 py-2 rounded-xl border transition-colors ${ocrConf.fill} ${ocrConf.border} min-w-[120px]`}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">OCR Read</span>
                            <span className={`text-xs font-mono font-bold ${ocrConf.text}`}>{(r.ocrConfidence ?? 0).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                            <div className={`h-full ${ocrConf.bg} rounded-full`} style={{ width: `${r.ocrConfidence || 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}