import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { TokenIssuanceSection } from './TokenIssuanceSection'

describe('TokenIssuanceSection', () => {
  const user = userEvent.setup()

  it('renders token issuance form', () => {
    render(<TokenIssuanceSection />)
    
    expect(screen.getByText('Token Issuance')).toBeInTheDocument()
    expect(screen.getByLabelText(/ticker/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/coin name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByText('Fee Receivers')).toBeInTheDocument()
  })

  it('validates ticker field correctly', async () => {
    render(<TokenIssuanceSection />)
    
    const tickerInput = screen.getByLabelText(/ticker/i)
    const submitButton = screen.getByRole('button', { name: /issue token/i })

    // Test empty ticker
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/ticker must be at least 3 characters/i)).toBeInTheDocument()
    })

    // Test too short ticker
    await user.type(tickerInput, 'AB')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/ticker must be at least 3 characters/i)).toBeInTheDocument()
    })

    // Test too long ticker
    await user.clear(tickerInput)
    await user.type(tickerInput, 'TOOLONG')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/ticker must be at most 5 characters/i)).toBeInTheDocument()
    })

    // Test invalid characters
    await user.clear(tickerInput)
    await user.type(tickerInput, 'abc')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/ticker must contain only uppercase letters and numbers/i)).toBeInTheDocument()
    })
  })

  it('validates coin name field correctly', async () => {
    render(<TokenIssuanceSection />)
    
    const coinNameInput = screen.getByLabelText(/coin name/i)
    const submitButton = screen.getByRole('button', { name: /issue token/i })

    // Test empty coin name
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/coin name is required/i)).toBeInTheDocument()
    })

    // Test too long coin name
    const longName = 'a'.repeat(51)
    await user.type(coinNameInput, longName)
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/coin name must be at most 50 characters/i)).toBeInTheDocument()
    })
  })

  it('shows character count for description', async () => {
    render(<TokenIssuanceSection />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    
    // Initially shows 0/255
    expect(screen.getByText('0/255')).toBeInTheDocument()
    
    // Updates count when typing
    await user.type(descriptionInput, 'Test description')
    expect(screen.getByText('16/255')).toBeInTheDocument()
  })

  it('validates description length', async () => {
    render(<TokenIssuanceSection />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /issue token/i })

    // Test too long description
    const longDescription = 'a'.repeat(256)
    await user.type(descriptionInput, longDescription)
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/description must be at most 255 characters/i)).toBeInTheDocument()
    })
  })

  it('allows adding fee receivers', async () => {
    render(<TokenIssuanceSection />)
    
    const addReceiverButton = screen.getByRole('button', { name: /add receiver/i })
    
    // Initially no receivers
    expect(screen.getByText('0/100 receivers')).toBeInTheDocument()
    expect(screen.getByText('No fee receivers added yet.')).toBeInTheDocument()
    
    // Add a receiver
    await user.click(addReceiverButton)
    
    expect(screen.getByText('1/100 receivers')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0x... or name.eth')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()
  })

  it('validates fee receiver share totals', async () => {
    render(<TokenIssuanceSection />)
    
    const addReceiverButton = screen.getByRole('button', { name: /add receiver/i })
    const submitButton = screen.getByRole('button', { name: /issue token/i })
    
    // Add receiver with valid data but invalid share total
    await user.click(addReceiverButton)
    
    const addressInput = screen.getByPlaceholderText('0x... or name.eth')
    const shareInput = screen.getByDisplayValue('0')
    
    await user.type(addressInput, '0x1234567890123456789012345678901234567890')
    await user.clear(shareInput)
    await user.type(shareInput, '50')
    
    // Should show invalid total
    expect(screen.getByText('50.00% / 100%')).toBeInTheDocument()
    
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/total share must equal 100%/i)).toBeInTheDocument()
    })
  })

  it('allows splitting receivers evenly', async () => {
    render(<TokenIssuanceSection />)
    
    const addReceiverButton = screen.getByRole('button', { name: /add receiver/i })
    const splitEvenlyButton = screen.getByRole('button', { name: /split evenly/i })
    
    // Add two receivers
    await user.click(addReceiverButton)
    await user.click(addReceiverButton)
    
    // Split evenly
    await user.click(splitEvenlyButton)
    
    // Should update shares to 50% each
    const shareInputs = screen.getAllByDisplayValue('50')
    expect(shareInputs).toHaveLength(2)
    expect(screen.getByText('100.00% / 100%')).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<TokenIssuanceSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/ticker/i), 'TEST')
    await user.type(screen.getByLabelText(/coin name/i), 'Test Token')
    await user.type(screen.getByLabelText(/description/i), 'A test token')
    
    // Add fee receiver
    await user.click(screen.getByRole('button', { name: /add receiver/i }))
    await user.type(screen.getByPlaceholderText('0x... or name.eth'), '0x1234567890123456789012345678901234567890')
    const shareInput = screen.getByDisplayValue('0')
    await user.clear(shareInput)
    await user.type(shareInput, '100')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /issue token/i }))
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Token issuance data:', expect.objectContaining({
        ticker: 'TEST',
        coinName: 'Test Token',
        description: 'A test token',
        feeReceivers: expect.arrayContaining([
          expect.objectContaining({
            address: '0x1234567890123456789012345678901234567890',
            share: 100
          })
        ])
      }))
    })
    
    consoleSpy.mockRestore()
  })
})