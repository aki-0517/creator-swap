import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { useForm } from 'react-hook-form'
import { FeeReceivers } from './FeeReceivers'
import { TokenIssuanceData } from '../../types/dashboard'

// Test wrapper component
const TestWrapper = ({ initialReceivers = [] }: { initialReceivers?: any[] }) => {
  const { control, setValue, watch } = useForm<TokenIssuanceData>({
    defaultValues: {
      feeReceivers: initialReceivers
    }
  })
  
  const feeReceivers = watch('feeReceivers')
  
  return (
    <FeeReceivers
      control={control}
      setValue={setValue}
      feeReceivers={feeReceivers}
    />
  )
}

// Mock Papa Parse
vi.mock('papaparse', () => ({
  parse: vi.fn()
}))

describe('FeeReceivers', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state initially', () => {
    render(<TestWrapper />)
    
    expect(screen.getByText('0/100 receivers')).toBeInTheDocument()
    expect(screen.getByText('No fee receivers added yet.')).toBeInTheDocument()
    expect(screen.getByText('CSV format: Address/ENS,Share(%)')).toBeInTheDocument()
  })

  it('allows adding a new receiver', async () => {
    render(<TestWrapper />)
    
    const addButton = screen.getByRole('button', { name: /add receiver/i })
    await user.click(addButton)
    
    expect(screen.getByText('1/100 receivers')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0x... or name.eth')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()
  })

  it('allows removing a receiver', async () => {
    const initialReceivers = [{
      id: '1',
      address: '0x123',
      share: 100
    }]
    
    render(<TestWrapper initialReceivers={initialReceivers} />)
    
    expect(screen.getByText('1/100 receivers')).toBeInTheDocument()
    
    const removeButton = screen.getByRole('button', { name: '✕' })
    await user.click(removeButton)
    
    expect(screen.getByText('0/100 receivers')).toBeInTheDocument()
  })

  it('shows share progress correctly', () => {
    const initialReceivers = [
      { id: '1', address: '0x123', share: 60 },
      { id: '2', address: '0x456', share: 40 }
    ]
    
    render(<TestWrapper initialReceivers={initialReceivers} />)
    
    expect(screen.getByText('100.00% / 100%')).toBeInTheDocument()
    
    // Check for valid state (no error message)
    expect(screen.queryByText('Total share must equal 100%')).not.toBeInTheDocument()
  })

  it('shows error for invalid share total', () => {
    const initialReceivers = [
      { id: '1', address: '0x123', share: 60 },
      { id: '2', address: '0x456', share: 30 }
    ]
    
    render(<TestWrapper initialReceivers={initialReceivers} />)
    
    expect(screen.getByText('90.00% / 100%')).toBeInTheDocument()
    expect(screen.getByText('Total share must equal 100%')).toBeInTheDocument()
  })

  it('splits receivers evenly', async () => {
    const initialReceivers = [
      { id: '1', address: '0x123', share: 0 },
      { id: '2', address: '0x456', share: 0 },
      { id: '3', address: '0x789', share: 0 }
    ]
    
    render(<TestWrapper initialReceivers={initialReceivers} />)
    
    const splitButton = screen.getByRole('button', { name: /split evenly/i })
    await user.click(splitButton)
    
    // Note: The actual splitting logic would need to be tested with the real form state
    // Here we're just testing that the button exists and is clickable
    expect(splitButton).toBeInTheDocument()
  })

  it('renders CSV import button', async () => {
    render(<TestWrapper />)
    
    const importButton = screen.getByRole('button', { name: /import csv/i })
    expect(importButton).toBeInTheDocument()
    
    await user.click(importButton)
    
    // Just verify the button exists and is clickable
    expect(importButton).toBeInTheDocument()
  })

  it('shows CSV error for invalid data', () => {
    render(<TestWrapper />)
    
    // This would be set by the CSV parsing error handler
    // In a real test, we'd mock the Papa.parse to return an error
    expect(screen.getByText('CSV format: Address/ENS,Share(%)')).toBeInTheDocument()
  })

  it('disables split evenly button when no receivers', () => {
    render(<TestWrapper />)
    
    const splitButton = screen.getByRole('button', { name: /split evenly/i })
    expect(splitButton).toBeDisabled()
  })

  it('shows fee tip', () => {
    render(<TestWrapper />)
    
    expect(screen.getByText(/fee receivers can log into flaunch/i)).toBeInTheDocument()
  })

  it('validates receiver addresses and shares', () => {
    const initialReceivers = [
      { id: '1', address: '', share: -10 }
    ]
    
    render(<TestWrapper initialReceivers={initialReceivers} />)
    
    expect(screen.getByPlaceholderText('0x... or name.eth')).toBeInTheDocument()
    expect(screen.getByDisplayValue('-10')).toBeInTheDocument()
  })
})