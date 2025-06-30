export interface FeeReceiver {
  id: string
  address: string
  share: number
}

export interface TokenIssuanceData {
  image: File | null
  ticker: string
  coinName: string
  description: string
  uri: string
  feeReceivers: FeeReceiver[]
}

export interface PoolSettingsData {
  initialLiquidity: string
  feeRate: number
  poolStatus: 'created' | 'pending' | 'none'
}

export interface RewardSettingsData {
  nftRewards: {
    enabled: boolean
    contractAddress: string
    tokenId: string
  }
  urlRewards: {
    enabled: boolean
    exclusiveUrl: string
  }
  conditions: {
    minHolding: string
    minTradingVolume: string
  }
}

export interface DashboardFormData {
  tokenIssuance: TokenIssuanceData
  poolSettings: PoolSettingsData
  rewardSettings: RewardSettingsData
}