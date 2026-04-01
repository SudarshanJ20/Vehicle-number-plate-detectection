import { useState } from 'react'
import { History, Search, Trash2, MapPin, Car, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

export default function HistoryPage({ history, setHistory }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = history.filter(r => {
    const matchSearch = r.plate_text?.toLowerCase().includes(search.toLowerCase()) ||
                        r.state?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || r.plate_type === filter
    return matchSearch && matchFilter
  })

  const types = ['all', ...new Set(history.map(r => r.plate_type).filter(Boolean))]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <History size={20} className="text-brand-500" /> Detection History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{history.length} detection{history.length !== 1 ? 's' : ''} this session</p>
        </div>
        {history.length > 0 && (
          <button onClick={() => setHistory([])} className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs">
            <Trash2 size={13} /> Clear All
          </button>
        )}
      </div>

      {/* Search + filter */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search plate or state..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                  filter === t ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <Empty hasHistory={history.length > 0} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  {['ID', 'Plate Number', 'State', 'Type', 'Det. Conf', 'OCR Conf', 'Time'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors animate-fade-in">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-brand-600 dark:text-brand-400 tracking-widest">{r.plate_text}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <MapPin size={11} className="text-gray-400" />{r.state}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('badge text-xs px-2 py-0.5 rounded-full font-medium',
                        r.plate_type === 'BH-Series' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                      )}>
                        <Car size={10} />{r.plate_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ConfBadge value={r.detection_confidence} />
                    </td>
                    <td className="px-4 py-3">
                      <ConfBadge value={r.ocr_confidence} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ConfBadge({ value }) {
  const v = parseFloat(value) || 0
  const color = v >= 85 ? 'text-emerald-600 dark:text-emerald-400'
    : v >= 65 ? 'text-brand-600 dark:text-brand-400'
    : 'text-amber-500'
  return <span className={clsx('font-mono font-semibold text-xs tabular-nums', color)}>{v.toFixed(1)}%</span>
}

function Empty({ hasHistory }) {
  return (
    <div className="card py-16 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <History size={20} className="text-gray-300 dark:text-gray-600" />
      </div>
      <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
        {hasHistory ? 'No results match your search' : 'No detections yet'}
      </p>
      <p className="text-xs text-gray-400 max-w-xs">
        {hasHistory ? 'Try a different search or filter.' : 'Go to the Detect page and upload a vehicle image to get started.'}
      </p>
    </div>
  )
}
