import { motion } from 'framer-motion'
import { Zap, Target, Globe, Cpu } from 'lucide-react'

const features = [
  { 
    icon: <Zap size={28} />, 
    color: 'text-indigo-600 dark:text-indigo-400', 
    bg: 'bg-indigo-100 dark:bg-indigo-500/10', 
    borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-500/30',
    glow: 'hover:shadow-indigo-500/10 dark:hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]',
    title: 'Real-Time Detection', 
    desc: 'Process live CCTV feeds or video streams at up to 30 FPS. Sub-80ms latency on standard hardware.', 
    tag: '30 FPS Support' 
  },
  { 
    icon: <Target size={28} />, 
    color: 'text-cyan-600 dark:text-cyan-400', 
    bg: 'bg-cyan-100 dark:bg-cyan-400/10', 
    borderHover: 'hover:border-cyan-300 dark:hover:border-cyan-400/30',
    glow: 'hover:shadow-cyan-500/10 dark:hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]',
    title: '98.4% Accuracy', 
    desc: 'Trained on 2M+ plate images across diverse conditions — night, rain, motion blur, and occlusion.', 
    tag: 'Production-Grade' 
  },
  { 
    icon: <Globe size={28} />, 
    color: 'text-violet-600 dark:text-violet-400', 
    bg: 'bg-violet-100 dark:bg-violet-400/10', 
    borderHover: 'hover:border-violet-300 dark:hover:border-violet-400/30',
    glow: 'hover:shadow-violet-500/10 dark:hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)]',
    title: 'Multi-Format Plates', 
    desc: 'Supports 50+ plate formats including Indian, US, EU, Middle Eastern, and Asian standards.', 
    tag: '50+ Formats' 
  },
  { 
    icon: <Cpu size={28} />, 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-100 dark:bg-emerald-400/10', 
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-400/30',
    glow: 'hover:shadow-emerald-500/10 dark:hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]',
    title: 'Edge Deployment', 
    desc: 'Optimized ONNX and TensorRT exports for Raspberry Pi, Jetson Nano, and other edge devices.', 
    tag: 'Offline Ready' 
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* ================= Centered Header Area ================= */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            Core Capabilities
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Built for accuracy,<br className="hidden md:block" /> designed for speed.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mx-auto"
          >
            Our AI pipeline seamlessly combines localization, extraction, and OCR into a single, unified architecture.
          </motion.p>
        </div>

        {/* ================= Centered Features Grid ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`group relative p-8 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300 ${f.borderHover} ${f.glow} flex flex-col items-center text-center`}
            >
              {/* Subtle inner gradient on hover (Dark Mode) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 dark:group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full items-center">
                {/* Centered Icon Container */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 transition-colors duration-300 ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">
                  {f.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1 transition-colors">
                  {f.desc}
                </p>
                
                <div className="mt-auto">
                  <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/[0.05] transition-colors">
                    {f.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}