import { ScanLine } from 'lucide-react'

const cols = [
  { title: 'Product',   links: ['Features','Live Demo','API Reference','Pricing','Changelog'] },
  { title: 'Use Cases', links: ['Traffic Systems','Smart Parking','Surveillance','Toll Automation'] },
  { title: 'Company',   links: ['About','GitHub','Blog','Contact','Privacy Policy'] },
]

export default function Footer() {
  return (
    <footer className="bg-[#030306] border-t border-white/[0.05] pt-14 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <ScanLine size={20} className="text-indigo-400" />PlateAI
              <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" style={{ boxShadow:'0 0 8px #22d3ee' }} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">AI-powered vehicle number plate detection for enterprises, municipalities, and developers.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5 list-none p-0">
                {col.links.map(l => <li key={l}><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors no-underline">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-7 border-t border-white/[0.05] flex-wrap gap-3">
          <p className="text-slate-600 text-xs">© 2026 PlateAI.</p>
          <div className="flex gap-2">
            {['G','T','L'].map((s,i) => <a key={i} href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-white text-xs font-bold no-underline transition-all">{s}</a>)}
          </div>
        </div>
      </div>
    </footer>
  )
}