import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, PlayCircle } from 'lucide-react'

const PLATES = ['KA 05 MN 2341','MH 12 AB 4567','DL 4C BG 8821','TN 09 F 3310','GJ 01 EX 5002','RJ 14 SA 0092','UP 32 CT 7711']

function FloatingPlates() {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    function spawn() {
      const el = document.createElement('div')
      el.textContent = PLATES[Math.floor(Math.random() * PLATES.length)]
      const dur = 14 + Math.random() * 10
      Object.assign(el.style, {
        position: 'absolute',
        left: (Math.random() * 92) + '%',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: '6px',
        padding: '4px 12px',
        fontFamily: '"Geist Mono", monospace',
        fontSize: '0.68rem',
        fontWeight: '600',
        color: 'rgba(99,102,241,0.35)',
        letterSpacing: '0.1em',
        animation: `floatPlate ${dur}s linear`,
        animationDelay: `-${Math.random() * dur}s`,
        pointerEvents: 'none',
      })
      container.appendChild(el)
      setTimeout(() => { if (container.contains(el)) container.removeChild(el) }, dur * 1000)
    }
    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 500)
    const id = setInterval(spawn, 2500)
    return () => clearInterval(id)
  }, [])
  return <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" />
}

const stats = [
  { num: '98.4%', label: 'Detection Accuracy' },
  { num: '<80ms', label: 'Processing Time'    },
  { num: '50+',   label: 'Plate Formats'      },
  { num: '24/7',  label: 'Live Detection'     },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(34,211,238,0.08) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0 hero-grid" />
      <FloatingPlates />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" style={{ boxShadow:'0 0 8px #22d3ee' }} />
          Powered by Deep Learning
        </motion.div>

        <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6">
          AI Vehicle Number<br />
          <span className="gradient-text">Plate Detection</span>
        </motion.h1>

        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.2, ease:[0.16,1,0.3,1] }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Detect and decode vehicle license plates in milliseconds using our state-of-the-art ML model.
          Supports multi-format plates, real-time video streams, and 98%+ accuracy across all lighting conditions.
        </motion.p>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3, ease:[0.16,1,0.3,1] }}
          className="flex items-center justify-center gap-3 flex-wrap">
          <motion.a href="#demo" whileHover={{ y:-2, boxShadow:'0 0 50px rgba(99,102,241,0.5)' }} whileTap={{ y:0 }}
            className="inline-flex items-center gap-2 bg-indigo-500 text-white font-bold text-base px-7 py-3.5 rounded-xl no-underline glow-primary">
            <Upload size={16} /> Try Demo
          </motion.a>
          <motion.a href="#how-it-works" whileHover={{ y:-1 }}
            className="inline-flex items-center gap-2 glass text-slate-400 hover:text-white font-semibold text-base px-6 py-3.5 rounded-xl no-underline transition-colors">
            <PlayCircle size={16} /> See How it Works
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.45, ease:[0.16,1,0.3,1] }}
          className="flex items-center justify-center gap-10 md:gap-16 mt-16 pt-10 border-t border-white/[0.06] flex-wrap">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text leading-none">{s.num}</div>
              <div className="text-xs text-slate-500 mt-1.5 font-semibold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}