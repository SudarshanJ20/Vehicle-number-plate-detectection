import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import DetectPage from './pages/DetectPage'
import HistoryPage from './pages/HistoryPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import Toast from './components/Toast'

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [history, setHistory] = useState([])
  const [toast, setToast] = useState(null)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(() => setToast(null), 3000) }
  const addToHistory = (r) => { setHistory(p => [r,...p].slice(0,100)); showToast('Plate detected: '+r.plate_text) }
  return (
    <Layout dark={dark} setDark={setDark}>
      <Routes>
        <Route path="/"          element={<DetectPage addToHistory={addToHistory}/>}/>
        <Route path="/history"   element={<HistoryPage history={history} setHistory={setHistory}/>}/>
        <Route path="/dashboard" element={<DashboardPage history={history}/>}/>
        <Route path="/about"     element={<AboutPage/>}/>
      </Routes>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </Layout>
  )
}