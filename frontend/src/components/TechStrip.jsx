import { Cpu, Layers, Zap, Eye, Server, Code2, Database, Cloud } from 'lucide-react'

const techs = [
  { icon: <Cpu size={15}/>, label: 'YOLOv8' },
  { icon: <Layers size={15}/>, label: 'OpenCV' },
  { icon: <Zap size={15}/>, label: 'TensorFlow' },
  { icon: <Eye size={15}/>, label: 'EasyOCR' },
  { icon: <Server size={15}/>, label: 'FastAPI' },
  { icon: <Code2 size={15}/>, label: 'PyTorch' },
  { icon: <Database size={15}/>, label: 'PostgreSQL' },
  { icon: <Cloud size={15}/>, label: 'AWS S3' },
]
const doubled = [...techs, ...techs]

export default function TechStrip() {
  return (
    <div className="bg-[#07070d] border-y border-white/[0.05] py-5 overflow-hidden">
      <div className="flex gap-12 w-max marquee-track">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2.5 whitespace-nowrap text-slate-500 text-sm font-semibold">
            <span className="opacity-50">{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  )
}