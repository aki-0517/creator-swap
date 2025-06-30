import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletButton } from '../components/WalletConnection'
import './TradingPage.css'

interface TradingPageProps {
  onNavigate: (page: 'trading' | 'dashboard' | 'launch') => void
}

export const TradingPage = ({ onNavigate }: TradingPageProps) => {
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [slippage, setSlippage] = useState('5.00')
  const { isConnected } = useAccount()

  const handleQuickAmount = (amount: string) => {
    if (activeTab === 'buy') {
      setBuyAmount(amount)
    } else {
      setSellAmount(amount)
    }
  }

  return (
    <div className="trading-page">
      {/* Header */}
      <header className="trading-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">CreatorSwap</span>
          </div>
          <nav className="nav-links">
            <a href="#coins">Coins</a>
            <a href="#leaderboard">Leaderboard</a>
            <a href="#how-it-works">How it works</a>
          </nav>
        </div>
        <div className="header-right">
          <input 
            type="text" 
            placeholder="Search coins" 
            className="search-input"
          />
          <WalletButton />
          <button 
            className="launch-coin-btn"
            onClick={() => onNavigate('dashboard')}
          >
            Launch Coin
          </button>
        </div>
      </header>

      <div className="trading-content">
        {/* Main Content */}
        <div className="main-section">
          {/* Token Info */}
          <div className="token-info">
            <div className="token-header">
              <div className="token-icon">
                <div className="icon-placeholder">MTX</div>
              </div>
              <div className="token-details">
                <h1>MATRIX</h1>
                <p className="token-address">CA: 0x01b1...5e2a92</p>
                <p className="token-age">Created 2 hours ago</p>
              </div>
            </div>
            <div className="token-description">
              <p><strong>Token name:</strong> MTX</p>
              <p><strong>Token description:</strong> GOOD JOB</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Price Chart</h3>
              <div className="chart-mock">
                <div className="chart-line"></div>
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Market cap</span>
              <span className="stat-value">$4.99K</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Volume (24h)</span>
              <span className="stat-value">$0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Liquidity</span>
              <span className="stat-value">-</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Holder count</span>
              <span className="stat-value">1</span>
            </div>
          </div>

          {/* Activity Tabs */}
          <div className="activity-section">
            <div className="activity-tabs">
              <button className="tab-button active">Transactions</button>
              <button className="tab-button">Holders (1)</button>
              <button className="tab-button">Advanced Info</button>
            </div>
            <div className="activity-content">
              <p>No activity yet</p>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="trading-panel">
          <div className="trading-tabs">
            <button 
              className={`tab-button ${activeTab === 'buy' ? 'active' : ''}`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button 
              className={`tab-button ${activeTab === 'sell' ? 'active' : ''}`}
              onClick={() => setActiveTab('sell')}
            >
              Sell
            </button>
          </div>

          <div className="trading-form">
            <div className="amount-section">
              <label>Enter the amount</label>
              <div className="amount-input">
                <input 
                  type="text" 
                  value={activeTab === 'buy' ? buyAmount : sellAmount}
                  onChange={(e) => activeTab === 'buy' ? setBuyAmount(e.target.value) : setSellAmount(e.target.value)}
                  placeholder="0"
                />
                <span className="currency">ETH</span>
              </div>
              <div className="balance-info">
                Balance: {isConnected ? '0.0143 ETH' : 'Not connected'}
              </div>
            </div>

            <div className="quick-amounts">
              <button onClick={() => handleQuickAmount('0.01')}>0.01 ETH</button>
              <button onClick={() => handleQuickAmount('0.1')}>0.1 ETH</button>
              <button onClick={() => handleQuickAmount('1')}>1 ETH</button>
              <button className="reset-btn">Reset</button>
            </div>

            <div className="trade-details">
              <div className="detail-row">
                <span>Min received</span>
                <span>-</span>
              </div>
              <div className="detail-row">
                <span>Max slippage</span>
                <div className="slippage-input">
                  <input 
                    type="text" 
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <button 
              className="swap-button" 
              disabled={!isConnected}
            >
              {isConnected ? 'Swap' : 'Connect Wallet'}
            </button>
          </div>

          {/* Chat Section */}
          <div className="chat-section">
            <h4>Community Chat</h4>
            <div className="chat-messages">
              <p className="no-messages">no messages yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}