import { useState, useEffect } from 'react'
import { ScanLine, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Use Cases', href: '#use-cases' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-[#050508]/90 border-b border-white/[0.06]' : 'bg-transparent'
      }`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <a href="#" className="flex items-center gap-2 font-bold text-white text-lg no-underline">
        <ScanLine size={22} className="text-indigo-400" />
        PlateAI
        <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" style={{ boxShadow: '0 0 8px #22d3ee' }} />
      </a>

      <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href} className="text-slate-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-all no-underline">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a href="#demo" className="ml-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all glow-primary no-underline">
            Try Demo
          </a>
        </li>
      </ul>

      <button className="md:hidden text-slate-400 hover:text-white bg-transparent border-none cursor-pointer" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#050508] border-b border-white/[0.06] py-4 px-6 flex flex-col gap-1 md:hidden"
          >
            {links.map(l => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-all no-underline">
                {l.label}
              </a>
            ))}
            <a href="#demo" onClick={() => setOpen(false)}
              className="mt-2 bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-lg text-center no-underline">
              Try Demo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}