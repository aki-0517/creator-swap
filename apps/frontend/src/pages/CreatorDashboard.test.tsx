import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { CreatorDashboard } from './CreatorDashboard'

// Mock the child components to avoid complex dependencies
vi.mock('../components/CreatorDashboard/TokenIssuanceSection', () => ({
  TokenIssuanceSection: () => <div data-testid="token-issuance">Token Issuance Section</div>
}))

vi.mock('../components/CreatorDashboard/PoolSettingsSection', () => ({
  PoolSettingsSection: () => <div data-testid="pool-settings">Pool Settings Section</div>
}))

vi.mock('../components/CreatorDashboard/RewardSettingsSection', () => ({
  RewardSettingsSection: () => <div data-testid="reward-settings">Reward Settings Section</div>
}))

describe('CreatorDashboard', () => {
  const user = userEvent.setup()

  it('renders dashboard header and navigation', () => {
    render(<CreatorDashboard />)
    
    expect(screen.getByText('Creator Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your token, pool settings, and rewards configuration')).toBeInTheDocument()
    
    expect(screen.getByRole('button', { name: 'Token Issuance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pool Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reward Settings' })).toBeInTheDocument()
  })

  it('shows token issuance section by default', () => {
    render(<CreatorDashboard />)
    
    expect(screen.getByTestId('token-issuance')).toBeInTheDocument()
    expect(screen.queryByTestId('pool-settings')).not.toBeInTheDocument()
    expect(screen.queryByTestId('reward-settings')).not.toBeInTheDocument()
    
    // Check active state
    const tokenButton = screen.getByRole('button', { name: 'Token Issuance' })
    expect(tokenButton).toHaveClass('active')
  })

  it('switches to pool settings section', async () => {
    render(<CreatorDashboard />)
    
    const poolButton = screen.getByRole('button', { name: 'Pool Settings' })
    await user.click(poolButton)
    
    expect(screen.getByTestId('pool-settings')).toBeInTheDocument()
    expect(screen.queryByTestId('token-issuance')).not.toBeInTheDocument()
    expect(screen.queryByTestId('reward-settings')).not.toBeInTheDocument()
    
    expect(poolButton).toHaveClass('active')
  })

  it('switches to reward settings section', async () => {
    render(<CreatorDashboard />)
    
    const rewardButton = screen.getByRole('button', { name: 'Reward Settings' })
    await user.click(rewardButton)
    
    expect(screen.getByTestId('reward-settings')).toBeInTheDocument()
    expect(screen.queryByTestId('token-issuance')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pool-settings')).not.toBeInTheDocument()
    
    expect(rewardButton).toHaveClass('active')
  })

  it('maintains active state correctly when switching sections', async () => {
    render(<CreatorDashboard />)
    
    const tokenButton = screen.getByRole('button', { name: 'Token Issuance' })
    const poolButton = screen.getByRole('button', { name: 'Pool Settings' })
    const rewardButton = screen.getByRole('button', { name: 'Reward Settings' })
    
    // Initially token is active
    expect(tokenButton).toHaveClass('active')
    expect(poolButton).not.toHaveClass('active')
    expect(rewardButton).not.toHaveClass('active')
    
    // Switch to pool
    await user.click(poolButton)
    expect(tokenButton).not.toHaveClass('active')
    expect(poolButton).toHaveClass('active')
    expect(rewardButton).not.toHaveClass('active')
    
    // Switch to reward
    await user.click(rewardButton)
    expect(tokenButton).not.toHaveClass('active')
    expect(poolButton).not.toHaveClass('active')
    expect(rewardButton).toHaveClass('active')
  })

  it('has proper navigation structure', () => {
    render(<CreatorDashboard />)
    
    const nav = screen.getByText('Token Issuance').closest('.dashboard-nav')
    
    expect(nav).toBeInTheDocument()
    
    const buttons = screen.getAllByRole('button')
    const navButtons = buttons.filter(button => 
      button.textContent === 'Token Issuance' ||
      button.textContent === 'Pool Settings' ||
      button.textContent === 'Reward Settings'
    )
    
    expect(navButtons).toHaveLength(3)
  })
})