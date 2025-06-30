import { useState } from 'react'
import './App.css'
import { TradingPage } from './pages/TradingPage'
import { CreatorDashboard } from './pages/CreatorDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'trading' | 'dashboard' | 'launch'>('trading')

  if (currentPage === 'dashboard') {
    return <CreatorDashboard onNavigate={setCurrentPage} />
  }

  return <TradingPage onNavigate={setCurrentPage} />
}

export default App