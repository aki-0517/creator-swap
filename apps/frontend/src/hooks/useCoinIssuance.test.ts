import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCoinIssuance } from './useCoinIssuance'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  usePublicClient: vi.fn(),
  useWriteContract: vi.fn(),
  useSimulateContract: vi.fn()
}))

// Mock Zora SDK
vi.mock('@zoralabs/coins-sdk', () => ({
  createCoinCall: vi.fn(),
  DeployCurrency: {
    ZORA: 1,
    ETH: 2
  },
  getCoinCreateFromLogs: vi.fn(),
  validateMetadataURIContent: vi.fn()
}))

// Mock viem
vi.mock('viem/chains', () => ({
  base: { id: 8453 }
}))

import { useAccount, usePublicClient, useWriteContract, useSimulateContract } from 'wagmi'
import { createCoinCall, validateMetadataURIContent } from '@zoralabs/coins-sdk'

const mockUseAccount = useAccount as ReturnType<typeof vi.fn>
const mockUsePublicClient = usePublicClient as ReturnType<typeof vi.fn>
const mockUseWriteContract = useWriteContract as ReturnType<typeof vi.fn>
const mockUseSimulateContract = useSimulateContract as ReturnType<typeof vi.fn>
const mockCreateCoinCall = createCoinCall as ReturnType<typeof vi.fn>
const mockValidateMetadataURIContent = validateMetadataURIContent as ReturnType<typeof vi.fn>

describe('useCoinIssuance', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as const
  const mockWriteContract = vi.fn()
  const mockPublicClient = {
    waitForTransactionReceipt: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true
    })
    
    mockUsePublicClient.mockReturnValue(mockPublicClient)
    
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract
    })
    
    mockUseSimulateContract.mockReturnValue({
      data: {
        request: {
          address: '0xContractAddress',
          abi: [],
          functionName: 'createCoin',
          args: []
        }
      },
      error: null
    })
    
    mockCreateCoinCall.mockResolvedValue({
      address: '0xContractAddress',
      abi: [],
      functionName: 'createCoin',
      args: []
    })
    
    mockValidateMetadataURIContent.mockResolvedValue(true)
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCoinIssuance())
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.txHash).toBeUndefined()
    expect(result.current.coinAddress).toBeUndefined()
  })

  it('should handle wallet not connected error', async () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false
    })
    
    const { result } = renderHook(() => useCoinIssuance())
    
    await act(async () => {
      await result.current.prepareIssuance({
        name: 'Test Coin',
        symbol: 'TEST',
        uri: 'ipfs://test'
      })
    })
    
    expect(result.current.error).toBe('Wallet not connected')
  })

  it('should prepare coin issuance successfully', async () => {
    const { result } = renderHook(() => useCoinIssuance())
    
    await act(async () => {
      await result.current.prepareIssuance({
        name: 'Test Coin',
        symbol: 'TEST',
        uri: 'ipfs://test'
      })
    })
    
    expect(mockValidateMetadataURIContent).toHaveBeenCalledWith('ipfs://test')
    expect(mockCreateCoinCall).toHaveBeenCalledWith({
      name: 'Test Coin',
      symbol: 'TEST',
      uri: 'ipfs://test',
      payoutRecipient: mockAddress,
      chainId: 8453,
      currency: 1 // DeployCurrency.ZORA
    })
    expect(result.current.error).toBe(null)
  })

  it('should handle metadata validation error', async () => {
    const validationError = new Error('Invalid metadata URI')
    mockValidateMetadataURIContent.mockRejectedValue(validationError)
    
    const { result } = renderHook(() => useCoinIssuance())
    
    await act(async () => {
      await result.current.prepareIssuance({
        name: 'Test Coin',
        symbol: 'TEST',
        uri: 'invalid://uri'
      })
    })
    
    expect(result.current.error).toBe('Invalid metadata URI')
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle coin issuance error when simulation fails', async () => {
    mockUseSimulateContract.mockReturnValue({
      data: null,
      error: new Error('Simulation failed')
    })
    
    const { result } = renderHook(() => useCoinIssuance())
    
    await act(async () => {
      await result.current.issueCoin()
    })
    
    expect(result.current.error).toBe('Contract simulation failed')
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useCoinIssuance())
    
    act(() => {
      result.current.resetState()
    })
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should determine canIssue correctly', () => {
    const { result } = renderHook(() => useCoinIssuance())
    
    expect(result.current.canIssue).toBe(true)
  })

  it('should return false for canIssue when not connected', () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false
    })
    
    const { result } = renderHook(() => useCoinIssuance())
    
    expect(result.current.canIssue).toBe(false)
  })
})