import { motion } from 'framer-motion'
import { Zap, Target, Globe, Cpu } from 'lucide-react'

const features = [
  { icon: <Zap size={22}/>, color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'Real-Time Detection', desc: 'Process live CCTV feeds or video streams at up to 30 FPS. Sub-80ms latency on standard hardware.', tag: '30 FPS Support' },
  { icon: <Target size={22}/>, color: 'text-cyan-400', bg: 'bg-cyan-400/10', title: '98.4% Accuracy', desc: 'Trained on 2M+ plate images across diverse conditions — night, rain, motion blur, and partial occlusion.', tag: 'Production-Grade' },
  { icon: <Globe size={22}/>, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'Multi-Format Plates', desc: 'Supports 50+ plate formats including Indian, US, EU, Middle Eastern, and Asian standards.', tag: '50+ Formats' },
  { icon: <Cpu size={22}/>, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Edge Deployment', desc: 'Optimized ONNX and TensorRT exports for Raspberry Pi, Jetson Nano, and other edge devices.', tag: 'Offline Ready' },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[#050508]">
      <div className="max-w-6xl mx-auto">
        <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-400 mb-3">✦ Core Capabilities</motion.p>
        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1, ease:[0.16,1,0.3,1] }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Built for accuracy,<br/>designed for speed
        </motion.h2>
        <motion.p initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
          className="text-slate-400 max-w-xl leading-relaxed mb-14">
          Our AI pipeline combines detection, localization, and OCR in a single unified architecture.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.1, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-4, borderColor:'rgba(99,102,241,0.4)', boxShadow:'0 0 40px rgba(99,102,241,0.08),0 20px 40px rgba(0,0,0,0.3)' }}
              className="glass rounded-2xl p-7 cursor-default transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bg} ${f.color}`}>{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              <span className="inline-block mt-4 text-[0.7rem] font-semibold px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">{f.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}