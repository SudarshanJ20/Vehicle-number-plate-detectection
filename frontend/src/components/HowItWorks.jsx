import { motion } from 'framer-motion'
import { UploadCloud, SlidersHorizontal, ScanLine, FileJson2 } from 'lucide-react'

const steps = [
  { icon: <UploadCloud size={26}/>, num: '01', title: 'Upload Image', desc: 'Submit a JPEG, PNG, or video frame. Supports drag-and-drop, URL, or direct API call.' },
  { icon: <SlidersHorizontal size={26}/>, num: '02', title: 'Pre-Processing', desc: 'Auto-contrast, noise reduction, and perspective correction normalize the image for the model.' },
  { icon: <ScanLine size={26}/>, num: '03', title: 'Plate Detection', desc: 'YOLOv8 locates the plate bounding box. EasyOCR extracts characters with confidence scores.' },
  { icon: <FileJson2 size={26}/>, num: '04', title: 'Structured Output', desc: 'Returns JSON with plate text, confidence, bounding box, region, and vehicle metadata.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#07070d]">
      <div className="max-w-6xl mx-auto">
        <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-400 mb-3">⚙ Process</motion.p>
        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }} className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Four steps to detection</motion.h2>
        <motion.p initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }} className="text-slate-400 max-w-xl leading-relaxed mb-16">
          Our end-to-end pipeline handles everything from raw image input to structured JSON output.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.15, ease:[0.16,1,0.3,1] }} className="text-center">
              <div className="flex justify-center mb-5">
                <motion.div whileHover={{ boxShadow:'0 0 24px rgba(99,102,241,0.4)', borderColor:'rgba(99,102,241,0.5)' }}
                  className="w-[72px] h-[72px] rounded-full glass flex items-center justify-center text-indigo-400 transition-all relative z-10">
                  {s.icon}
                </motion.div>
              </div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Step {s.num}</p>
              <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}