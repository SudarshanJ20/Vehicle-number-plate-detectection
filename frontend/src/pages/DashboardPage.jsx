import { useEffect, useState, useMemo } from 'react';
import { BarChart2, TrendingUp, MapPin, Car, Target, Activity, Zap, PieChart as PieIcon } from 'lucide-react';
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserDetections } from '../firebase/detections';

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6'];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserDetections(user.uid, 500)
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // --- Data Aggregation ---
  const { total, avgDet, avgOCR, stateData, typeData, trendData } = useMemo(() => {
    const t = history.length;
    if (t === 0) return { total: 0 };

    const avgD = history.reduce((a, r) => a + (parseFloat(r.detectionConfidence) || 0), 0) / t;
    const avgO = history.reduce((a, r) => a + (parseFloat(r.ocrConfidence) || 0), 0) / t;

    const sCounts = {};
    const tCounts = {};
    history.forEach(r => {
      if (r.state) sCounts[r.state] = (sCounts[r.state] || 0) + 1;
      if (r.plateType) tCounts[r.plateType] = (tCounts[r.plateType] || 0) + 1;
    });

    const sData = Object.entries(sCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const tData = Object.entries(tCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const trData = history.slice(0, 15).reverse().map((r, i) => ({
      name: `#${i + 1}`,
      Detection: parseFloat(r.detectionConfidence?.toFixed?.(1)) || 0,
      OCR: parseFloat(r.ocrConfidence?.toFixed?.(1)) || 0,
    }));

    return { total: t, avgDet: avgD, avgOCR: avgO, stateData: sData, typeData: tData, trendData: trData };
  }, [history]);

  if (loading) return <DashboardSkeleton />;
  if (total === 0) return <EmptyDashboard />;

  return (
    <div className="text-slate-700 dark:text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-6 py-10 md:p-12 relative z-10 space-y-8">

        {/* Dashboard Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4 transition-colors">
            <Activity size={12} className="animate-pulse" /> Telemetry
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Analytics Engine</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 transition-colors">Real-time performance metrics compiled from {total} processed images.</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* --- KPI Row --- */}
          {[
            { icon: Target, label: 'Total Volume', value: total, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/10', border: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-500/30', glow: 'group-hover:shadow-indigo-500/10 dark:group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]' },
            { icon: Zap, label: 'Detection Accuracy', value: `${avgDet.toFixed(1)}%`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30', glow: 'group-hover:shadow-emerald-500/10 dark:group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]' },
            { icon: Activity, label: 'OCR Confidence', value: `${avgOCR.toFixed(1)}%`, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-500/10', border: 'group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30', glow: 'group-hover:shadow-cyan-500/10 dark:group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]' },
            { icon: MapPin, label: 'Geographic Span', value: stateData.length, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-500/10', border: 'group-hover:border-violet-300 dark:group-hover:border-violet-500/30', glow: 'group-hover:shadow-violet-500/10 dark:group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)]' },
          ].map((kpi, i) => (
            <motion.div key={i} variants={itemVariant} className={`group relative p-6 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300 ${kpi.border} ${kpi.glow}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent dark:from-white/[0.02] dark:to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1"> {kpi.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight transition-colors">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon size={22} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* --- Main Area Chart --- */}
          <motion.div variants={itemVariant} className="xl:col-span-2 md:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl flex flex-col transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                <TrendingUp size={16} className="text-indigo-500" /> Confidence Volatility
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-slate-400 transition-colors">
                Last {trendData.length} scans
              </span>
            </div>
            
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOcr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/[0.03]" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400 dark:text-slate-500" axisLine={false} tickLine={false} dy={10} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400 dark:text-slate-500" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--tw-bg-opacity)', 
                      backgroundColor: 'rgb(255 255 255 / 0.8)',
                      backdropFilter: 'blur(10px)', 
                      border: '1px solid rgba(0,0,0,0.05)', 
                      borderRadius: '12px' 
                    }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                    // Tooltip specific for dark mode via dynamic style is harder in pure CSS without a custom component, 
                    // but standard "recharts-tooltip-wrapper" usually works fine with backdrop filters.
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Detection" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDet)" activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="OCR" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorOcr)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* --- Plate Types Progress Bars --- */}
          <motion.div variants={itemVariant} className="xl:col-span-2 md:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl flex flex-col transition-all duration-500">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <Car size={16} className="text-indigo-500" /> Plate Classification
            </h2>
            <div className="flex-1 flex flex-col justify-center space-y-5">
              {typeData.length > 0 ? typeData.map(({ name, value }) => (
                <div key={name} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{name || 'Unknown'}</span>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/[0.03] px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.05] group-hover:text-indigo-500 transition-colors">
                      {value} <span className="font-sans font-normal opacity-70">plates</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.02]">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(value / total) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>
              )) : <div className="text-slate-400 text-sm text-center italic">No classifications available</div>}
            </div>
          </motion.div>

          {/* --- State Breakdown (Donut Chart) --- */}
          <motion.div variants={itemVariant} className="xl:col-span-2 md:col-span-1 p-6 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl flex flex-col items-center justify-center relative min-h-[300px] transition-all duration-500">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white absolute top-6 left-6 flex items-center gap-2 transition-colors">
              <PieIcon size={16} className="text-indigo-500" /> State Distribution
            </h2>
            {stateData.length > 0 ? (
              <div className="w-full h-[220px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stateData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {stateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />)}
                    </Pie>
                    <Tooltip 
                      formatter={(v) => [`${v} detections`, 'Volume']}
                      contentStyle={{ background: 'white', border: 'none', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-slate-400 italic">No geographical data</p>}
          </motion.div>

          {/* --- Top States List --- */}
          <motion.div variants={itemVariant} className="xl:col-span-2 md:col-span-1 p-6 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-500">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <MapPin size={16} className="text-indigo-500" /> Geographic Leaders
            </h2>
            <div className="space-y-3">
              {stateData.slice(0, 5).map(({ name, value }, i) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shadow-sm" style={{ backgroundColor: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}>
                      #{i + 1}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium transition-colors">{name || 'Unidentified'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white transition-colors">{value}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Plates</p>
                  </div>
                </div>
              ))}
              {stateData.length === 0 && <p className="text-sm text-slate-400 text-center py-4 italic transition-colors">No data to display</p>}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

// --- Helper Components (Updated for Themes) ---

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto space-y-8">
      <div className="w-48 h-8 bg-slate-200 dark:bg-white/5 rounded-lg animate-pulse mb-2" />
      <div className="w-96 h-4 bg-slate-100 dark:bg-white/5 rounded-full animate-pulse" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] animate-pulse" />
        ))}
        <div className="xl:col-span-2 md:col-span-2 h-80 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] animate-pulse" />
        <div className="xl:col-span-2 md:col-span-2 h-80 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] animate-pulse" />
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-lg dark:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-colors">
          <BarChart2 size={40} className="text-indigo-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">Awaiting Telemetry</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed transition-colors">
          Your dashboard is currently empty. Run your first vehicle detection scan to start populating this intelligence matrix.
        </p>
      </motion.div>
    </div>
  );
}