import clsx from 'clsx'

export default function ConfidenceBar({ label, value, color = 'brand' }) {
  const pct = Math.min(100, Math.max(0, value))
  const colorMap = {
    brand:  'bg-brand-500',
    green:  'bg-emerald-500',
    amber:  'bg-amber-500',
    red:    'bg-red-500',
  }
  const getColor = (v) => {
    if (v >= 85) return colorMap.green
    if (v >= 65) return colorMap.brand
    if (v >= 45) return colorMap.amber
    return colorMap.red
  }
  const barColor = getColor(pct)
  const textColor = pct >= 85 ? 'text-emerald-600 dark:text-emerald-400'
    : pct >= 65 ? 'text-brand-600 dark:text-brand-400'
    : pct >= 45 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-500'

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className={clsx('text-xs font-mono font-semibold', textColor)}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full conf-bar', barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
