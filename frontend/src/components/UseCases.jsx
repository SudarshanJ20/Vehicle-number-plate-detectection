import { motion } from 'framer-motion';
import { TrafficCone, ParkingCircle, ShieldCheck, Receipt } from 'lucide-react';

const cases = [
  { 
    icon: <TrafficCone size={28} />, 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-400/10', 
    title: 'Traffic Monitoring', 
    desc: 'Integrate with city cameras to automate vehicle tracking, detect stolen vehicles, and assist law enforcement at checkpoints.', 
    tag: 'Smart City' 
  },
  { 
    icon: <ParkingCircle size={28} />, 
    color: 'text-violet-600 dark:text-violet-400', 
    bg: 'bg-violet-100 dark:bg-violet-400/10', 
    title: 'Smart Parking Systems',  
    desc: 'Automate entry/exit gates with zero human intervention. Track occupancy per vehicle and generate billing reports from plate logs.', 
    tag: 'Automation' 
  },
  { 
    icon: <ShieldCheck size={28} />, 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-100 dark:bg-emerald-400/10', 
    title: 'Security Surveillance',  
    desc: 'Whitelist/blacklist vehicle plates for gated premises and campuses. Alert security instantly on unauthorized access attempts.', 
    tag: 'Access Control' 
  },
  { 
    icon: <Receipt size={28} />, 
    color: 'text-orange-600 dark:text-orange-400',      
    bg: 'bg-orange-100 dark:bg-orange-400/10',  
    title: 'Toll Automation',       
    desc: 'Replace manual toll booths with fully automated plate-based billing. Reduce congestion and seamlessly integrate with payment gateways.', 
    tag: 'Toll & Finance' 
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Background Glow */}
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px] pointer-events-none -translate-x-1/2 translate-y-1/3" />
      
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
            Applications
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Where PlateAI makes an impact
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }} 
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mx-auto"
          >
            From city-scale traffic systems to private parking lots, our inference engine powers high-stakes real-world applications.
          </motion.p>
        </div>

        {/* ================= Centered Use Cases Grid ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {cases.map((c, i) => (
            <motion.div 
              key={c.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-lg dark:hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] flex flex-col items-center text-center"
            >
              {/* Subtle inner gradient on hover (Dark Mode) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 dark:group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
              
              {/* Centered Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 transition-colors duration-300 ${c.bg} ${c.color}`}>
                {c.icon}
              </div>
              
              {/* Centered Content */}
              <div className="relative z-10 flex flex-col h-full items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">
                  {c.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 transition-colors">
                  {c.desc}
                </p>
                
                <div className="mt-auto">
                  <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/[0.05] transition-colors">
                    {c.tag}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}