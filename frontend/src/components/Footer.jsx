import { ScanLine, Github, Twitter, Linkedin, ArrowRight, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Live Demo', href: '/detect' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'History', href: '/history' },
    ]
  },
  // {
  //   title: 'Use Cases',
  //   links: [
  //     { label: 'Traffic Systems', href: '#' },
  //     { label: 'Smart Parking', href: '#' },
  //     { label: 'Surveillance', href: '#' },
  //     { label: 'Toll Automation', href: '#' },
  //   ]
  // },
  {
    title: 'Project',
    links: [
      { label: 'About', href: '/about' },
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: 'Tech Stack', href: '/about' },
      { label: 'Contact', href: '#' },
    ]
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#09090b] relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Decorative Horizon Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[200px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 pt-16 pb-8 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* ================= Brand Column ================= */}
          <div className="lg:col-span-5 pr-0 lg:pr-12 flex flex-col items-start">
            
            {/* Logo */}
            <div className="flex items-center gap-3 text-white font-extrabold text-2xl tracking-tight mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <ScanLine size={20} className="text-indigo-400" />
              </div>
              PlateAI
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              A state-of-the-art Deep Learning Automatic Number Plate Recognition System. Engineered for the chaos of real-world Indian traffic.
            </p>
            
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/[0.03] border border-emerald-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} /> Neural API Online
              </span>
            </div>
          </div>

          {/* ================= Link Columns ================= */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map(col => (
              <div key={col.title}>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6 relative inline-block">
                  {col.title}
                  <span className="absolute -bottom-2 left-0 w-3 h-0.5 bg-indigo-500/50 rounded-full" />
                </h4>
                
                <ul className="space-y-3.5 list-none p-0">
                  {col.links.map(({ label, href, external }) => {
                    const LinkContent = (
                      <>
                        <span className="w-0 overflow-hidden opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 flex items-center">
                          <ArrowRight size={14} className="text-indigo-400" />
                        </span>
                        <span className="group-hover:translate-x-1 group-hover:text-indigo-300 transition-all duration-300">
                          {label}
                        </span>
                      </>
                    );

                    const className = "group flex items-center text-slate-400 text-sm font-medium transition-all no-underline w-fit";

                    return (
                      <li key={label}>
                        {external ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                            {LinkContent}
                          </a>
                        ) : href.startsWith('/') ? (
                          <Link to={href} className={className}>
                            {LinkContent}
                          </Link>
                        ) : (
                          <a href={href} className={className}>
                            {LinkContent}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Bottom Bar ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05] gap-4">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} PlateAI Architecture. Built with YOLO11 & EasyOCR.
          </p>
          
          <div className="flex gap-3">
            {[
              { icon: Github, href: 'https://github.com' },
              { icon: Twitter, href: '#' },
              { icon: Linkedin, href: '#' },
            ].map(({ icon: Icon, href }, i) => (
              <a 
                key={i} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 shadow-sm"
              >
                <Icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}