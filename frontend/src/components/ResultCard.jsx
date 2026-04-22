import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, MapPin, Car, Cpu, Download, AlertTriangle, ImageIcon, Sparkles, Terminal } from 'lucide-react';

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function ResultCard({ result, originalUrl }) {
  const [copied, setCopied] = useState(false);

  const copy = () => { 
    navigator.clipboard.writeText(result.plate_text); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000);
  };

  const dl = () => {
    const b = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(b); 
    a.download = `anpr_${result.plate_text || 'result'}.json`; 
    a.click();
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 w-full max-w-2xl mx-auto"
    >
      
      {/* Offline / Mock Notice */}
      {result._mock && (
        <motion.div variants={itemVariants} className="flex items-start sm:items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-sm dark:shadow-none">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <strong className="font-bold">Offline Demo Mode</strong> — Connect the backend with <code className="font-mono bg-amber-100 dark:bg-amber-500/20 px-1 rounded">best.pt</code> to execute real YOLO11 inference.
          </p>
        </motion.div>
      )}

      {/* Main Plate Display */}
      <motion.div variants={itemVariants} className="relative p-8 rounded-[2rem] bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none overflow-hidden text-center group">
        
        {/* Subtle background glow in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />

        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Extracted Plate Data</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="relative px-6 py-3 rounded-xl bg-slate-50 dark:bg-[#0a0a10] border-2 border-slate-200 dark:border-white/10 shadow-inner">
            <span 
              className="font-mono text-4xl md:text-5xl font-black tracking-[0.15em] text-slate-900 dark:text-white"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
            >
              {result.plate_text || 'UNKNOWN'}
            </span>
          </div>
          
          <button 
            onClick={copy} 
            title="Copy to clipboard"
            className={`p-4 rounded-xl transition-all duration-300 shadow-sm ${
              copied 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' 
                : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 border border-transparent dark:border-white/[0.05]'
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20">
            <MapPin size={12} /> {result.state || 'Unknown State'}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-500/20">
            <Car size={12} /> {result.plate_type || 'Standard'}
          </span>
        </div>

        <button 
          onClick={dl} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] transition-colors border border-slate-200 dark:border-white/[0.05]"
        >
          <Download size={14} /> Export Raw JSON
        </button>
      </motion.div>

      {/* Grid for Image and Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Source Image Preview */}
        {originalUrl && (
          <motion.div variants={itemVariants} className="p-4 rounded-3xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ImageIcon size={12} /> Source Frame
            </h3>
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0a0a10] border border-slate-200 dark:border-white/5 flex-1 flex items-center justify-center min-h-[200px]">
              <img src={originalUrl} alt="Analyzed Vehicle" className="w-full h-full object-contain opacity-90" />
              
              {/* Simulated YOLO Bounding Box Overlay */}
              {result.plate_text && (
                <motion.div 
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 group"
                >
                  {/* Targeting Corners */}
                  <div className="absolute -inset-2 border-2 border-emerald-400/50 rounded-lg pointer-events-none group-hover:border-emerald-400 transition-colors" style={{ clipPath: 'polygon(0 0, 20% 0, 20% 100%, 0 100%, 0 20%, 100% 20%, 100% 0, 80% 0, 80% 100%, 100% 100%, 100% 80%, 0 80%)' }} />
                  
                  <div className="border border-emerald-400/30 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <span className="font-mono text-emerald-400 font-bold tracking-widest text-xs sm:text-sm">
                      {result.plate_text}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* System Diagnostics */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          
          {/* Confidence Scores */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none flex-1">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Cpu size={12} className="text-indigo-500 dark:text-indigo-400" /> Neural Confidence
            </h3>
            
            <div className="space-y-5">
              {/* Detection Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-500 dark:text-slate-400">YOLO11 Detection</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{(result.detection_confidence || 0).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${result.detection_confidence || 0}%` }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </div>

              {/* OCR Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-500 dark:text-slate-400">EasyOCR Read</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">{(result.ocr_confidence || 0).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${result.ocr_confidence || 0}%` }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preprocessing Logs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-amber-500" /> Pipeline Enhancements
            </h3>
            
            {result.preprocessing_applied && result.preprocessing_applied.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.preprocessing_applied.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Terminal size={10} className="text-slate-400 dark:text-slate-500" /> {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">Standard processing applied. No enhancements needed.</p>
            )}
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}