import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { ReactNode } from 'react'
import { WalletButton } from './WalletButton'

interface MockConnectButtonProps {
  account: null
  chain: null
  openAccountModal: () => void
  openChainModal: () => void
  openConnectModal: () => void
  authenticationStatus: string
  mounted: boolean
}

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: (props: MockConnectButtonProps) => ReactNode }) => {
      // Mock the props that ConnectButton.Custom would provide
      const mockProps: MockConnectButtonProps = {
        account: null,
        chain: null,
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: vi.fn(),
        authenticationStatus: 'unauthenticated',
        mounted: true,
      }
      return children(mockProps)
    },
  },
}))

describe('WalletButton Component', () => {
  it('should render connect wallet button when not connected', () => {
    render(<WalletButton />)
    expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument()
  })

  it('should have correct CSS classes', () => {
    render(<WalletButton />)
    const button = screen.getByRole('button', { name: 'Connect Wallet' })
    expect(button).toHaveClass('btn', 'btn-primary')
  })
})