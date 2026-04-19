import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import LandingPage from './pages/LandingPage'
import DetectPage from './pages/DetectPage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [history, setHistory] = useState([])

  const addToHistory = (item) => {
    setHistory((prev) => [item, ...prev])
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/detect" element={<DetectPage addToHistory={addToHistory} />} />
        <Route path="/dashboard" element={<DashboardPage history={history} />} />
        <Route path="/history" element={<HistoryPage history={history} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}