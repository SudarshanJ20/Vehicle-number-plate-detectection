import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
export default function Toast({ msg, type, onClose }) {
  const styles = { success:'bg-emerald-600 text-white', error:'bg-red-600 text-white', info:'bg-teal-700 text-white' }
  const icons  = { success:CheckCircle, error:AlertCircle, info:Info }
  const Icon = icons[type] || Info
  return (
    <div className={'toast animate-slide-up ' + (styles[type] || styles.info)}>
      <Icon size={16}/>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14}/></button>
    </div>
  )
}