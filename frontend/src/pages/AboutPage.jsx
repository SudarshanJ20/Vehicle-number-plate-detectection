import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Eye, FileText, Layers, CheckCircle2 } from 'lucide-react';

const STACK = [
  { layer: 'Detection Model', tech: 'YOLO11', detail: 'Latest architecture — faster & more accurate than v8', color: 'indigo' },
  { layer: 'OCR Engine',      tech: 'EasyOCR',      detail: 'Handles Indian number plates, robust to fonts & angles',      color: 'cyan'  },
  { layer: 'Preprocessing',   tech: 'OpenCV + CLAHE',      detail: 'Night/low-light enhancement, sharpening, denoising',        color: 'amber' },
  { layer: 'Backend API',     tech: 'FastAPI',      detail: 'Async REST API — /detect, /history, /health endpoints',     color: 'emerald' },
  { layer: 'Frontend',        tech: 'React + Vite',        detail: 'Fast SPA with Recharts analytics & Tailwind CSS',           color: 'violet'},
  { layer: 'Dataset',         tech: 'Roboflow ANPR', detail: '4000+ annotated Indian plate images, YOLO format',          color: 'rose'  },
];

const PIPELINE = [
  { step: '01', title: 'Image Upload',        desc: 'User uploads vehicle image via drag & drop or file picker' },
  { step: '02', title: 'Brightness Check',    desc: 'Auto-detect low-light conditions (mean brightness < 80/255)' },
  { step: '03', title: 'CLAHE Enhancement',   desc: 'Apply Contrast Limited AHE to improve dark/blurry plates' },
  { step: '04', title: 'YOLO11 Detection',    desc: 'Localize plate region — returns bounding box + confidence' },
  { step: '05', title: 'Plate Crop & Polish', desc: 'Crop plate, apply CLAHE again for maximum OCR accuracy' },
  { step: '06', title: 'EasyOCR Recognition', desc: 'Extract text from plate crop — returns text + confidence' },
  { step: '07', title: 'Post-processing',     desc: 'Format text, fix OCR misreads (O→0, I→1), extract state' },
  { step: '08', title: 'Result & Analytics',  desc: 'Return annotated image, plate text, state, confidence scores' },
];

const UNIQUE_FEATURES = [
  'Indian plate focus — handles old, new & BH-series',
  'CLAHE night enhancement — auto-applies in low-light',
  'OCR error correction — fixes common misreads (O→0)',
  'Real-time analytics — state breakdown & confidence trends',
  'Demo mode — works without backend for instant presentations',
  'YOLO11 Architecture — 2024 Ultralytics model'
];

// Updated mapping to support Light & Dark modes seamlessly
const colorMap = {
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-500/5',  border: 'border-indigo-100 dark:border-indigo-500/20',  text: 'text-indigo-600 dark:text-indigo-400',  glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-500/5',    border: 'border-cyan-100 dark:border-cyan-500/20',    text: 'text-cyan-600 dark:text-cyan-400',    glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-500/5',   border: 'border-amber-100 dark:border-amber-500/20',   text: 'text-amber-600 dark:text-amber-400',   glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/5', border: 'border-emerald-100 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-500/5',  border: 'border-violet-100 dark:border-violet-500/20',  text: 'text-violet-600 dark:text-violet-400',  glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-500/5',    border: 'border-rose-100 dark:border-rose-500/20',    text: 'text-rose-600 dark:text-rose-400',    glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]' },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function AboutPage() {
  return (
    <div className="text-slate-900 dark:text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-500">
      
      {/* Background Ambient Glows (Moved slightly so they complement the Layout glows) */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 py-12 md:p-12 lg:p-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* LEFT COLUMN: Sticky Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                System Architecture
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4 transition-colors">
                Behind <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                  PlateAI
                </span>
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                A state-of-the-art Deep Learning Automatic Number Plate Recognition System. 
                Built to handle the chaos of real-world Indian traffic, low-light environments, and non-standard plate formats.
              </p>
            </div>

            {/* Unique Features Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <FileText size={16} className="text-indigo-500 dark:text-indigo-400" /> Key Capabilities
              </h2>
              <ul className="space-y-3">
                {UNIQUE_FEATURES.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                    <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400/70 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Scrollable Content Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 space-y-8"
          >
            {/* Tech Stack Bento Box */}
            <motion.div variants={itemVariant} className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 px-1 transition-colors">
                <Cpu size={18} className="text-indigo-500 dark:text-indigo-400" /> Core Technologies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {STACK.map(({ layer, tech, detail, color }) => {
                  const c = colorMap[color];
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      key={layer} 
                      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${c.bg} ${c.border} ${c.glow} bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none backdrop-blur-sm`}
                    >
                      {/* Subtle hover gradient inside card */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent dark:from-white/[0.01] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <p className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2`}>{layer}</p>
                        <p className={`font-bold text-lg mb-1 ${c.text}`}>{tech}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Pipeline Timeline */}
            <motion.div variants={itemVariant} className="space-y-4 pt-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 px-1 transition-colors">
                <Layers size={18} className="text-indigo-500 dark:text-indigo-400" /> Execution Pipeline
              </h2>
              
              <div className="relative p-6 md:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300">
                {/* Vertical Line */}
                <div className="absolute left-[39px] md:left-[47px] top-12 bottom-12 w-px bg-gradient-to-b from-indigo-300 dark:from-indigo-500/50 via-cyan-300 dark:via-cyan-500/20 to-transparent transition-colors" />

                <div className="space-y-8 relative">
                  {PIPELINE.map(({ step, title, desc }, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      key={step} 
                      className="flex gap-4 md:gap-6 items-start group"
                    >
                      {/* Number Node */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 dark:bg-[#0f0f13] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-sm font-bold font-mono flex items-center justify-center shrink-0 relative z-10 group-hover:border-indigo-400 dark:group-hover:border-indigo-500/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shadow-sm dark:shadow-xl">
                        {step}
                      </div>
                      
                      {/* Content */}
                      <div className="pt-2 md:pt-3">
                        <p className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-500 mt-1.5 leading-relaxed max-w-xl transition-colors">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}