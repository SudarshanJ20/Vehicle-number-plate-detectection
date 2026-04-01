import { BarChart2, TrendingUp, MapPin, Car, Target } from 'lucide-react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#01696f','#4dbfc4','#0c4e54','#7dd9dc','#afeaec','#01a3a8','#0f3638']

export default function DashboardPage({ history }) {
  const total = history.length
  const avgDet = total ? (history.reduce((a, r) => a + (parseFloat(r.detection_confidence) || 0), 0) / total) : 0
  const avgOCR = total ? (history.reduce((a, r) => a + (parseFloat(r.ocr_confidence) || 0), 0) / total) : 0

  // State frequency
  const stateCounts = {}
  history.forEach(r => { if (r.state) stateCounts[r.state] = (stateCounts[r.state] || 0) + 1 })
  const stateData = Object.entries(stateCounts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)

  // Plate type counts
  const typeCounts = {}
  history.forEach(r => { if (r.plate_type) typeCounts[r.plate_type] = (typeCounts[r.plate_type] || 0) + 1 })
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

  // Confidence trend (last 10)
  const trendData = history.slice(0, 10).reverse().map((r, i) => ({
    name: `#${i + 1}`,
    Detection: parseFloat(r.detection_confidence)?.toFixed(1),
    OCR: parseFloat(r.ocr_confidence)?.toFixed(1),
  }))

  if (total === 0) return <EmptyDashboard />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BarChart2 size={20} className="text-brand-500" /> Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Performance metrics from {total} detection{total !== 1 ? 's' : ''} this session</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Target} label="Total Detections" value={total} unit="" color="brand" />
        <KPICard icon={TrendingUp} label="Avg Detection Conf" value={avgDet.toFixed(1)} unit="%" color="emerald" />
        <KPICard icon={TrendingUp} label="Avg OCR Conf" value={avgOCR.toFixed(1)} unit="%" color="teal" />
        <KPICard icon={MapPin} label="Unique States" value={Object.keys(stateCounts).length} unit="" color="purple" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Confidence Trend */}
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-500" /> Confidence Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Detection" stroke="#01696f" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="OCR" stroke="#4dbfc4" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* State breakdown */}
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={14} className="text-brand-500" /> State Breakdown
          </h2>
          {stateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stateData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {stateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} detection${v !== 1 ? 's' : ''}`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400">No state data</p>}
        </div>
      </div>

      {/* Plate type + Top states table */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plate types */}
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Car size={14} className="text-brand-500" /> Plate Types Detected
          </h2>
          <div className="space-y-2">
            {typeData.map(({ name, value }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-300 w-32 truncate">{name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${(value / total) * 100}%` }} />
                </div>
                <span className="text-xs font-mono font-semibold text-gray-500 w-6 text-right tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top states */}
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={14} className="text-brand-500" /> Top States
          </h2>
          <div className="space-y-2">
            {stateData.slice(0, 6).map(({ name, value }, i) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</span>
                  <span className="text-gray-700 dark:text-gray-300 text-xs">{name}</span>
                </div>
                <span className="font-mono font-semibold text-xs tabular-nums text-gray-500">{value} plate{value !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ icon: Icon, label, value, unit, color }) {
  const colorMap = {
    brand:   'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    teal:    'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30',
    purple:  'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
  }
  return (
    <div className="card p-4 space-y-2 animate-slide-up">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={15} />
      </div>
      <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}<span className="text-base font-normal text-gray-400">{unit}</span></p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <BarChart2 size={20} className="text-brand-500" /> Analytics Dashboard
      </h1>
      <div className="card py-20 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">No data yet</p>
        <p className="text-xs text-gray-400 max-w-xs">Run some detections first — analytics will populate automatically.</p>
      </div>
    </div>
  )
}
