import { RewardSettingsSection } from '../components/CreatorDashboard/RewardSettingsSection'

interface CreatorDashboardProps {
  onNavigate: (page: 'trading' | 'dashboard' | 'launch') => void
}

export const CreatorDashboard = ({ onNavigate }: CreatorDashboardProps) => {
  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <div className="header-controls">
          <button 
            className="back-button"
            onClick={() => onNavigate('trading')}
          >
            ← Back to Trading
          </button>
        </div>
        <h1>Creator Dashboard</h1>
        <p>Configure your coin parameters and reward system</p>
      </div>

      <div className="dashboard-content">
        <RewardSettingsSection />
      </div>
    </div>
  )
}