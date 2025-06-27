import { useState } from 'react'
import { TokenIssuanceSection } from '../components/CreatorDashboard/TokenIssuanceSection'
import { PoolSettingsSection } from '../components/CreatorDashboard/PoolSettingsSection'
import { RewardSettingsSection } from '../components/CreatorDashboard/RewardSettingsSection'

export const CreatorDashboard = () => {
  const [activeSection, setActiveSection] = useState<'token' | 'pool' | 'reward'>('token')

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <p>Manage your token, pool settings, and rewards configuration</p>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-button ${activeSection === 'token' ? 'active' : ''}`}
          onClick={() => setActiveSection('token')}
        >
          Token Issuance
        </button>
        <button 
          className={`nav-button ${activeSection === 'pool' ? 'active' : ''}`}
          onClick={() => setActiveSection('pool')}
        >
          Pool Settings
        </button>
        <button 
          className={`nav-button ${activeSection === 'reward' ? 'active' : ''}`}
          onClick={() => setActiveSection('reward')}
        >
          Reward Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeSection === 'token' && <TokenIssuanceSection />}
        {activeSection === 'pool' && <PoolSettingsSection />}
        {activeSection === 'reward' && <RewardSettingsSection />}
      </div>
    </div>
  )
}