import { motion } from 'framer-motion'
import { TrafficCone, ParkingCircle, ShieldCheck, Receipt } from 'lucide-react'

const cases = [
  { icon: <TrafficCone size={24}/>, color:'text-blue-400',    bg:'bg-blue-400/10',    title:'Traffic Monitoring',    desc:'Integrate with city cameras to automate vehicle tracking, detect stolen vehicles, and assist law enforcement at checkpoints.', tag:'Smart City' },
  { icon: <ParkingCircle size={24}/>, color:'text-violet-400', bg:'bg-violet-400/10', title:'Smart Parking Systems',  desc:'Automate entry/exit gates with zero human intervention. Track occupancy per vehicle and generate billing reports from plate logs.', tag:'Automation' },
  { icon: <ShieldCheck size={24}/>, color:'text-emerald-400', bg:'bg-emerald-400/10', title:'Security Surveillance',  desc:'Whitelist/blacklist vehicle plates for gated premises and campuses. Alert security instantly on unauthorized access attempts.', tag:'Access Control' },
  { icon: <Receipt size={24}/>, color:'text-orange-400',      bg:'bg-orange-400/10',  title:'Toll Automation',       desc:'Replace manual toll booths with fully automated plate-based billing. Reduce congestion and integrate with payment gateways.', tag:'Toll & Finance' },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 px-6 bg-[#050508] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.04] blur-[70px] bg-cyan-400 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-400 mb-3">⊞ Applications</motion.p>
        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }} className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Where PlateAI makes an impact</motion.h2>
        <motion.p initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }} className="text-slate-400 max-w-xl leading-relaxed mb-14">
          From city-scale traffic systems to private parking lots, our engine powers real-world applications.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cases.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.1, ease:[0.16,1,0.3,1] }}
              whileHover={{ borderColor:'rgba(99,102,241,0.35)', y:-3, boxShadow:'0 20px 50px rgba(0,0,0,0.4)' }}
              className="glass rounded-2xl p-8 flex gap-6 items-start cursor-default transition-colors">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.bg} ${c.color}`}>{c.icon}</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                <span className="inline-block mt-3 text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.08] text-slate-500">{c.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}