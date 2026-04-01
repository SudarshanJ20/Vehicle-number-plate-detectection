import { NavLink } from 'react-router-dom'
import { ScanLine, History, BarChart2, Info, Sun, Moon, Github } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',          label: 'Detect',    icon: ScanLine  },
  { to: '/history',   label: 'History',   icon: History   },
  { to: '/dashboard', label: 'Analytics', icon: BarChart2 },
  { to: '/about',     label: 'About',     icon: Info      },
]

export default function Layout({ children, dark, setDark }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="ANPR Logo">
              <rect x="2" y="8" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-brand-600"/>
              <rect x="5" y="11" width="6" height="6" rx="1" fill="currentColor" className="text-brand-500"/>
              <rect x="13" y="11" width="3" height="6" rx="0.5" fill="currentColor" className="text-brand-600"/>
              <rect x="17" y="11" width="3" height="6" rx="0.5" fill="currentColor" className="text-brand-600"/>
              <rect x="21" y="11" width="2" height="6" rx="0.5" fill="currentColor" className="text-brand-600"/>
              <circle cx="7" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" className="text-gray-500"/>
              <circle cx="21" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" className="text-gray-500"/>
            </svg>
            <div>
              <span className="font-semibold text-sm tracking-tight">ANPR</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">Detection System</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}>
                <Icon size={14} />{label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               className="btn-ghost p-2 rounded-lg" aria-label="GitHub">
              <Github size={16} />
            </a>
            <button onClick={() => setDark(d => !d)} className="btn-ghost p-2 rounded-lg" aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-gray-200 dark:border-gray-800">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-brand-600' : 'text-gray-500 dark:text-gray-400'
              )}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
