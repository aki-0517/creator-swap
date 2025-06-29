import { 
  feeReceiverSchema, 
  tokenIssuanceSchema, 
  poolSettingsSchema, 
  rewardSettingsSchema 
} from './dashboard'

describe('Dashboard Schemas', () => {
  describe('feeReceiverSchema', () => {
    it('validates valid fee receiver', () => {
      const validReceiver = {
        id: '1',
        address: '0x1234567890123456789012345678901234567890',
        share: 50
      }
      
      const result = feeReceiverSchema.safeParse(validReceiver)
      expect(result.success).toBe(true)
    })

    it('rejects empty address', () => {
      const invalidReceiver = {
        id: '1',
        address: '',
        share: 50
      }
      
      const result = feeReceiverSchema.safeParse(invalidReceiver)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe('Address is required')
    })

    it('rejects negative share', () => {
      const invalidReceiver = {
        id: '1',
        address: '0x1234567890123456789012345678901234567890',
        share: -10
      }
      
      const result = feeReceiverSchema.safeParse(invalidReceiver)
      expect(result.success).toBe(false)
    })

    it('rejects share over 100', () => {
      const invalidReceiver = {
        id: '1',
        address: '0x1234567890123456789012345678901234567890',
        share: 110
      }
      
      const result = feeReceiverSchema.safeParse(invalidReceiver)
      expect(result.success).toBe(false)
    })
  })

  describe('tokenIssuanceSchema', () => {
    it('validates valid token data', () => {
      const validToken = {
        ticker: 'TEST',
        coinName: 'Test Token',
        description: 'A test token',
        feeReceivers: [
          { id: '1', address: '0x123', share: 100 }
        ]
      }
      
      const result = tokenIssuanceSchema.safeParse(validToken)
      expect(result.success).toBe(true)
    })

    it('validates ticker length and format', () => {
      // Too short
      let result = tokenIssuanceSchema.safeParse({
        ticker: 'AB',
        coinName: 'Test',
        description: '',
        feeReceivers: [{ id: '1', address: '0x123', share: 100 }]
      })
      expect(result.success).toBe(false)

      // Too long
      result = tokenIssuanceSchema.safeParse({
        ticker: 'TOOLONG',
        coinName: 'Test',
        description: '',
        feeReceivers: [{ id: '1', address: '0x123', share: 100 }]
      })
      expect(result.success).toBe(false)

      // Invalid characters
      result = tokenIssuanceSchema.safeParse({
        ticker: 'test',
        coinName: 'Test',
        description: '',
        feeReceivers: [{ id: '1', address: '0x123', share: 100 }]
      })
      expect(result.success).toBe(false)
    })

    it('validates coin name length', () => {
      const result = tokenIssuanceSchema.safeParse({
        ticker: 'TEST',
        coinName: 'a'.repeat(51),
        description: '',
        feeReceivers: [{ id: '1', address: '0x123', share: 100 }]
      })
      expect(result.success).toBe(false)
    })

    it('validates description length', () => {
      const result = tokenIssuanceSchema.safeParse({
        ticker: 'TEST',
        coinName: 'Test',
        description: 'a'.repeat(256),
        feeReceivers: [{ id: '1', address: '0x123', share: 100 }]
      })
      expect(result.success).toBe(false)
    })

    it('validates fee receiver share totals', () => {
      // Invalid total (not 100%)
      let result = tokenIssuanceSchema.safeParse({
        ticker: 'TEST',
        coinName: 'Test',
        description: '',
        feeReceivers: [
          { id: '1', address: '0x123', share: 50 },
          { id: '2', address: '0x456', share: 40 }
        ]
      })
      expect(result.success).toBe(false)

      // Valid total (100%)
      result = tokenIssuanceSchema.safeParse({
        ticker: 'TEST',
        coinName: 'Test',
        description: '',
        feeReceivers: [
          { id: '1', address: '0x123', share: 60 },
          { id: '2', address: '0x456', share: 40 }
        ]
      })
      expect(result.success).toBe(true)
    })
  })

  describe('poolSettingsSchema', () => {
    it('validates valid pool settings', () => {
      const validPool = {
        initialLiquidity: '1.0',
        feeRate: 0.3,
        poolStatus: 'created' as const
      }
      
      const result = poolSettingsSchema.safeParse(validPool)
      expect(result.success).toBe(true)
    })

    it('requires initial liquidity', () => {
      const result = poolSettingsSchema.safeParse({
        initialLiquidity: '',
        feeRate: 0.3,
        poolStatus: 'none' as const
      })
      expect(result.success).toBe(false)
    })

    it('validates fee rate range', () => {
      // Too low
      let result = poolSettingsSchema.safeParse({
        initialLiquidity: '1.0',
        feeRate: 0.005,
        poolStatus: 'none' as const
      })
      expect(result.success).toBe(false)

      // Too high
      result = poolSettingsSchema.safeParse({
        initialLiquidity: '1.0',
        feeRate: 1.5,
        poolStatus: 'none' as const
      })
      expect(result.success).toBe(false)
    })

    it('validates pool status enum', () => {
      const result = poolSettingsSchema.safeParse({
        initialLiquidity: '1.0',
        feeRate: 0.3,
        poolStatus: 'invalid' as any
      })
      expect(result.success).toBe(false)
    })
  })

  describe('rewardSettingsSchema', () => {
    it('validates valid reward settings', () => {
      const validRewards = {
        nftRewards: {
          enabled: true,
          contractAddress: '0x1234567890123456789012345678901234567890',
          tokenId: '123'
        },
        urlRewards: {
          enabled: true,
          exclusiveUrl: 'https://example.com/exclusive'
        },
        conditions: {
          minHolding: '10',
          minTradingVolume: '1.0'
        }
      }
      
      const result = rewardSettingsSchema.safeParse(validRewards)
      expect(result.success).toBe(true)
    })

    it('validates URL format', () => {
      const result = rewardSettingsSchema.safeParse({
        nftRewards: { enabled: false },
        urlRewards: {
          enabled: true,
          exclusiveUrl: 'not-a-url'
        },
        conditions: {
          minHolding: '0',
          minTradingVolume: '0'
        }
      })
      expect(result.success).toBe(false)
    })

    it('allows optional fields when disabled', () => {
      const result = rewardSettingsSchema.safeParse({
        nftRewards: { enabled: false },
        urlRewards: { enabled: false },
        conditions: {
          minHolding: '0',
          minTradingVolume: '0'
        }
      })
      expect(result.success).toBe(true)
    })
  })
})