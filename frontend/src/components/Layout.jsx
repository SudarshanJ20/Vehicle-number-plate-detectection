import { NavLink } from 'react-router-dom'
import { ScanLine, History, BarChart2, Info, Sun, Moon } from 'lucide-react'
const NAV = [
  { to:'/', label:'Detect', icon:ScanLine },
  { to:'/history', label:'History', icon:History },
  { to:'/dashboard', label:'Analytics', icon:BarChart2 },
  { to:'/about', label:'About', icon:Info }
]
export default function Layout({ children, dark, setDark }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <ScanLine size={16} className="text-white"/>
            </div>
            <span className="font-bold text-sm">ANPR <span className="text-teal-600 dark:text-teal-400">System</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon:Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => 'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ' +
                  (isActive ? 'bg-teal-700 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                <Icon size={14}/>{label}
              </NavLink>
            ))}
          </nav>
          <button onClick={() => setDark(d => !d)} className="btn-ghost">
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-20 md:pb-6">{children}</main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <div className="flex">
          {NAV.map(({ to, label, icon:Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => 'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ' +
                (isActive ? 'text-teal-700 dark:text-teal-400' : 'text-gray-400')}>
              <Icon size={18}/>{label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}