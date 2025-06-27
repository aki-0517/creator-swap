import { z } from 'zod'

export const feeReceiverSchema = z.object({
  id: z.string(),
  address: z.string().min(1, 'Address is required'),
  share: z.number().min(0).max(100)
})

export const tokenIssuanceFormSchema = z.object({
  ticker: z.string()
    .min(3, 'Ticker must be at least 3 characters')
    .max(5, 'Ticker must be at most 5 characters')
    .regex(/^[A-Z0-9]+$/, 'Ticker must contain only uppercase letters and numbers'),
  coinName: z.string()
    .min(1, 'Coin name is required')
    .max(50, 'Coin name must be at most 50 characters'),
  description: z.string()
    .max(255, 'Description must be at most 255 characters'),
  feeReceivers: z.array(feeReceiverSchema)
    .refine(
      (receivers) => {
        const totalShare = receivers.reduce((sum, receiver) => sum + receiver.share, 0)
        return Math.abs(totalShare - 100) < 0.01
      },
      'Total share must equal 100%'
    )
})

export const tokenIssuanceSchema = tokenIssuanceFormSchema

export const poolSettingsSchema = z.object({
  initialLiquidity: z.string().min(1, 'Initial liquidity is required'),
  feeRate: z.number().min(0.01).max(1),
  poolStatus: z.enum(['created', 'pending', 'none'])
})

export const rewardSettingsSchema = z.object({
  nftRewards: z.object({
    enabled: z.boolean(),
    contractAddress: z.string().optional(),
    tokenId: z.string().optional()
  }),
  urlRewards: z.object({
    enabled: z.boolean(),
    exclusiveUrl: z.string().url().optional()
  }),
  conditions: z.object({
    minHolding: z.string(),
    minTradingVolume: z.string()
  })
})

export const dashboardFormSchema = z.object({
  tokenIssuance: tokenIssuanceSchema,
  poolSettings: poolSettingsSchema,
  rewardSettings: rewardSettingsSchema
})