export default function ConfidenceBar({ label, value }) {
  const pct   = Math.min(100, Math.max(0, parseFloat(value) || 0))
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 65 ? 'bg-teal-600' : 'bg-amber-500'
  const text  = pct >= 85 ? 'text-emerald-500' : pct >= 65 ? 'text-teal-500' : 'text-amber-500'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className={'text-xs font-mono font-bold ' + text}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={'h-full rounded-full transition-all duration-1000 ease-out ' + color} style={{ width: pct + '%' }}/>
      </div>
    </div>
  )
}