import { useState } from 'react'
import { useAccount, usePublicClient, useWriteContract, useSimulateContract } from 'wagmi'
import { createCoinCall, DeployCurrency, getCoinCreateFromLogs, validateMetadataURIContent } from '@zoralabs/coins-sdk'
import type { Address, Hex } from 'viem'
import { base } from 'viem/chains'

export interface CoinParams {
  name: string
  symbol: string
  uri: string
  payoutRecipient: Address
  platformReferrer?: Address
  chainId?: number
  currency?: DeployCurrency
}

export interface CoinIssuanceState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  txHash?: Hex
  coinAddress?: Address
}

export const useCoinIssuance = () => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  
  const [state, setState] = useState<CoinIssuanceState>({
    isLoading: false,
    isSuccess: false,
    error: null
  })

  const [contractCallParams, setContractCallParams] = useState<any>(null)

  const { data: simulateConfig, error: simulateError } = useSimulateContract(
    contractCallParams ? {
      ...contractCallParams,
      account: address
    } : undefined
  )

  const { writeContract } = useWriteContract()

  const prepareIssuance = async (params: Omit<CoinParams, 'payoutRecipient'>) => {
    if (!address || !isConnected) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Validate metadata URI
      await validateMetadataURIContent(params.uri)

      const coinParams: CoinParams = {
        ...params,
        payoutRecipient: address,
        chainId: params.chainId || base.id,
        currency: params.currency || DeployCurrency.ZORA
      }

      const callParams = await createCoinCall(coinParams)
      setContractCallParams(callParams)
      
      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to prepare coin issuance' 
      }))
    }
  }

  const issueCoin = async () => {
    if (!simulateConfig || !writeContract) {
      setState(prev => ({ ...prev, error: 'Contract simulation failed' }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      writeContract(simulateConfig.request, {
        onSuccess: async (hash: Hex) => {
          setState(prev => ({ 
            ...prev, 
            txHash: hash,
            isSuccess: false // Will be set to true when transaction is confirmed
          }))

          // Wait for transaction confirmation and extract coin address
          if (publicClient) {
            try {
              const receipt = await publicClient.waitForTransactionReceipt({ hash })
              const coinCreateResult = getCoinCreateFromLogs(receipt)
              
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                isSuccess: true,
                coinAddress: coinCreateResult?.coin
              }))
            } catch (error) {
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: 'Transaction failed or could not be confirmed'
              }))
            }
          }
        },
        onError: (error) => {
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: error.message || 'Failed to issue coin' 
          }))
        }
      })
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to issue coin' 
      }))
    }
  }

  const resetState = () => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: null
    })
    setContractCallParams(null)
  }

  return {
    ...state,
    prepareIssuance,
    issueCoin,
    resetState,
    canIssue: !!simulateConfig && !simulateError && isConnected,
    simulateError: simulateError?.message
  }
}