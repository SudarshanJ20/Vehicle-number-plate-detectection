import { useState, useEffect } from 'react'
import { ScanLine, Menu, X, UserCircle2, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../firebase/auth'

const guestLinks = [
  { label: 'Features', href: '#features', type: 'anchor' },
  { label: 'How it Works', href: '#how-it-works', type: 'anchor' },
  { label: 'Use Cases', href: '#use-cases', type: 'anchor' },
]

const userLinks = [
  { label: 'Dashboard', href: '/dashboard', type: 'route' },
  { label: 'History', href: '/history', type: 'route' },
  { label: 'About', href: '/about', type: 'route' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  // Handle scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = user ? userLinks : guestLinks

  const handleLogout = async () => {
    await logOut()
    setOpen(false)
  }

  const isActive = (href) => location.pathname === href

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.05] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-105 transition-transform duration-300">
            <ScanLine size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white transition-colors">
            Plate<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">AI</span>
          </span>
        </Link>

        {/* ================= DESKTOP LINKS ================= */}
        <ul className="hidden md:flex items-center gap-1.5 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.label}>
              {link.type === 'route' ? (
                <Link
                  to={link.href}
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 no-underline ${
                    isActive(link.href)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-white/[0.08] dark:text-white shadow-sm dark:shadow-none'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white text-sm font-semibold px-4 py-2 rounded-xl dark:hover:bg-white/[0.04] transition-all duration-300 no-underline"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}

          {/* Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2" />

          {/* Auth Controls */}
          {!user ? (
            <li>
              <Link
                to="/auth"
                className="ml-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md dark:shadow-[0_0_20px_rgba(99,102,241,0.3)] no-underline"
              >
                Login / Sign Up
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/detect"
                  className={`ml-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 no-underline shadow-md ${
                    isActive('/detect')
                      ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-900'
                      : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white dark:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  }`}
                >
                  Try Demo
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className={`ml-2 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 no-underline border border-transparent ${
                    isActive('/profile')
                      ? 'bg-slate-100 border-slate-200 text-slate-900 dark:bg-white/[0.08] dark:border-white/[0.05] dark:text-white'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-white/[0.04] dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <UserCircle2 size={18} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm font-semibold max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="ml-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 text-sm font-medium p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/[0.08] transition-all bg-transparent border-none cursor-pointer group"
                  title="Logout"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </li>
            </>
          )}
        </ul>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] p-2 rounded-xl border-none cursor-pointer transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-white/[0.05] shadow-2xl md:hidden overflow-hidden"
          >
            <div className="py-4 px-6 flex flex-col gap-2">
              {links.map((link) =>
                link.type === 'route' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-base font-semibold px-4 py-3 rounded-xl transition-all no-underline ${
                      isActive(link.href)
                        ? 'text-indigo-600 bg-indigo-50 dark:text-white dark:bg-white/[0.08]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] text-base font-semibold px-4 py-3 rounded-xl transition-all no-underline"
                  >
                    {link.label}
                  </a>
                )
              )}

              <div className="h-px bg-slate-100 dark:bg-white/[0.05] my-2" />

              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-2 bg-slate-900 text-white dark:bg-indigo-500 dark:text-white text-base font-bold px-4 py-3.5 rounded-xl text-center no-underline shadow-lg"
                >
                  Login / Sign Up
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/[0.05]">
                    <UserCircle2 size={24} className="text-indigo-500 dark:text-indigo-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                        {user.displayName || 'User Profile'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/detect"
                    onClick={() => setOpen(false)}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-base font-bold px-4 py-3.5 rounded-xl text-center no-underline shadow-lg"
                  >
                    Launch Scanner
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] text-base font-semibold px-4 py-3 rounded-xl transition-all no-underline text-center border border-slate-200 dark:border-white/[0.05]"
                  >
                    Manage Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-2 text-rose-600 dark:text-rose-400 text-base font-bold px-4 py-3 rounded-xl text-center bg-rose-50 dark:bg-rose-500/[0.05] border border-rose-200 dark:border-rose-500/20"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}