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

  // Color helper for progress bars and text
  const confColor = (v) => {
    const val = parseFloat(v) || 0;
    if (val >= 85) return { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-500/30', fill: 'bg-emerald-500/20' };
    if (val >= 65) return { text: 'text-indigo-400', bg: 'bg-indigo-400', border: 'border-indigo-500/30', fill: 'bg-indigo-500/20' };
    return { text: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-500/30', fill: 'bg-amber-500/20' };
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-300 font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 py-10 md:p-12 relative z-10 space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
              <Database size={12} /> Data Ledger
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Detection Logs</h1>
            <p className="text-sm text-slate-400 mt-2">Historical database of all localized and recognized vehicle plates.</p>
          </motion.div>

          {/* KPI Mini-Cards (Only show if loaded & has data) */}
          {!loading && stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { label: 'Total Scans', value: stats.total, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { label: 'High Accuracy', value: `${stats.accuracyRate}%`, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'States Logged', value: stats.states, icon: MapPin, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                    <p className="text-xl font-extrabold text-white leading-tight">{stat.value}</p>
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
            className="p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by plate number, state, or attributes..."
                className="w-full pl-11 pr-4 py-3 text-sm bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0"
              />
            </div>
            
            {/* Divider on desktop */}
            <div className="hidden sm:block w-px bg-white/10 my-2 mx-2" />
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 px-2 sm:px-0 hide-scrollbar">
              <Filter size={14} className="text-slate-500 shrink-0 ml-2 sm:ml-0 mr-1" />
              {types.map(t => (
                <button 
                  key={t} 
                  onClick={() => setFilter(t)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    filter === t
                      ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="relative">
          
          {/* Skeleton Loader */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse flex items-center px-6 gap-6">
                  <div className="w-32 h-6 bg-white/5 rounded-md" />
                  <div className="flex gap-2"><div className="w-16 h-5 bg-white/5 rounded-full" /><div className="w-16 h-5 bg-white/5 rounded-full" /></div>
                  <div className="flex-1" />
                  <div className="w-24 h-8 bg-white/5 rounded-lg" />
                  <div className="w-24 h-8 bg-white/5 rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                <div className="w-20 h-20 rounded-3xl bg-[#161625] border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
                  <History size={32} className="text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {detections.length > 0 ? 'No records found' : 'Database Empty'}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                {detections.length > 0 
                  ? 'Your search parameters yielded no results. Try adjusting the filters.' 
                  : 'You haven\'t processed any images yet. Head over to the scanner to begin.'}
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
                      className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:p-5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-300"
                    >
                      {/* Left: Plate & Metadata */}
                      <div className="flex items-center gap-6">
                        <div className="px-4 py-2 rounded-xl bg-[#0f0f13] border border-white/5 shadow-inner">
                          <p className="font-mono text-xl md:text-2xl font-bold text-white tracking-[0.15em] group-hover:text-indigo-300 transition-colors">
                            {r.plateText}
                          </p>
                        </div>
                        
                        <div className="space-y-2 hidden sm:block">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[11px] font-medium text-slate-400">
                              <MapPin size={10} className="text-indigo-400" /> {r.state || 'Unknown'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[11px] font-medium text-slate-400">
                              <Car size={10} className="text-cyan-400" /> {r.plateType || 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Clock size={10} />
                            {r.createdAt instanceof Date 
                              ? r.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                              : 'Timestamp unavailable'}
                          </div>
                        </div>
                      </div>

                      {/* Right: Confidence Visualizers */}
                      <div className="flex flex-row gap-4 sm:ml-auto">
                        
                        {/* Detection Bar */}
                        <div className={`flex flex-col justify-center px-4 py-2 rounded-xl border ${detConf.fill} ${detConf.border} min-w-[120px]`}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Detection</span>
                            <span className={`text-xs font-mono font-bold ${detConf.text}`}>{(r.detectionConfidence ?? 0).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                            <div className={`h-full ${detConf.bg} rounded-full`} style={{ width: `${r.detectionConfidence || 0}%` }} />
                          </div>
                        </div>

                        {/* OCR Bar */}
                        <div className={`flex flex-col justify-center px-4 py-2 rounded-xl border ${ocrConf.fill} ${ocrConf.border} min-w-[120px]`}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">OCR Read</span>
                            <span className={`text-xs font-mono font-bold ${ocrConf.text}`}>{(r.ocrConfidence ?? 0).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
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