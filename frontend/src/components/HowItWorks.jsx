import { motion } from 'framer-motion';
import { UploadCloud, SlidersHorizontal, ScanLine, FileJson2 } from 'lucide-react';

const steps = [
  { 
    icon: <UploadCloud size={24} />, 
    num: '01', 
    title: 'Image Ingestion', 
    desc: 'Submit a JPEG, PNG, or video frame. Supports drag-and-drop, direct upload, or API feed.' 
  },
  { 
    icon: <SlidersHorizontal size={24} />, 
    num: '02', 
    title: 'CLAHE Pre-Processing', 
    desc: 'Auto-contrast, night-vision enhancement, and denoising normalize the image for the neural model.' 
  },
  { 
    icon: <ScanLine size={24} />, 
    num: '03', 
    title: 'YOLO11 Detection', 
    desc: 'Ultralytics YOLO11 locates the plate bounding box. EasyOCR extracts characters with confidence scoring.' 
  },
  { 
    icon: <FileJson2 size={24} />, 
    num: '04', 
    title: 'Structured Output', 
    desc: 'Returns JSON with plate text, OCR confidence, bounding box coordinates, and region metadata.' 
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
            Execution Pipeline
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }} 
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Four steps to detection
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }} 
            className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed"
          >
            Our end-to-end pipeline handles everything from raw image input to structured JSON output in milliseconds.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative max-w-5xl mx-auto">
          
          {/* Animated Connecting Line (Desktop Only) */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="hidden lg:block absolute top-[36px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-400/50 dark:via-indigo-500/50 to-transparent origin-left" 
          />

          {steps.map((s, i) => (
            <motion.div 
              key={s.num} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }} 
              className="relative text-center group"
            >
              {/* Icon Node */}
              <div className="flex justify-center mb-6 relative">
                <motion.div 
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="w-[72px] h-[72px] rounded-2xl bg-white dark:bg-[#161625] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-center text-indigo-500 dark:text-indigo-400 transition-all duration-300 relative z-10 group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                >
                  {/* Subtle inner glow in dark mode */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 dark:group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">{s.icon}</div>
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
                  Phase {s.num}
                </p>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto transition-colors">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}