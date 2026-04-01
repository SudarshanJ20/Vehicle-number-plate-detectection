import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import DetectPage from './pages/DetectPage'
import HistoryPage from './pages/HistoryPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [history, setHistory] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const addToHistory = (record) => {
    setHistory(prev => [record, ...prev].slice(0, 50))
  }

  return (
    <Layout dark={dark} setDark={setDark}>
      <Routes>
        <Route path="/"          element={<DetectPage addToHistory={addToHistory} />} />
        <Route path="/history"   element={<HistoryPage history={history} setHistory={setHistory} />} />
        <Route path="/dashboard" element={<DashboardPage history={history} />} />
        <Route path="/about"     element={<AboutPage />} />
      </Routes>
    </Layout>
  )
}
