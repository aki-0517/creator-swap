import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { rewardSettingsSchema } from '../../schemas/dashboard'
import { Button } from '../Button/Button'

export const RewardSettingsSection = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(rewardSettingsSchema),
    defaultValues: {
      // Zora Coin Settings
      zoraCoin: {
        name: '',
        symbol: '',
        uri: '',
        payoutRecipient: '',
        platformReferrer: '',
        currency: 'ETH' as 'ETH' | 'ZORA',
        chainId: 8453 // Base mainnet
      },
      // Reward Settings
      nftRewards: {
        enabled: false,
        contractAddress: '',
        tokenId: ''
      },
      urlRewards: {
        enabled: false,
        exclusiveUrl: ''
      },
      conditions: {
        minHolding: '0',
        minTradingVolume: '0'
      }
    }
  })

  const nftEnabled = watch('nftRewards.enabled')
  const urlEnabled = watch('urlRewards.enabled')

  const onSubmit = (data: any) => {
    console.log('Reward settings data:', data)
  }

  return (
    <div className="reward-settings-section">
      <div className="section-header">
        <h2>Coin & Reward Settings</h2>
        <p>Configure your Zora coin parameters and reward system for token holders</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="reward-form">
        {/* Zora Coin Configuration */}
        <div className="zora-coin-section">
          <h3>Zora Coin Configuration</h3>
          <p>Set up your coin parameters for deployment on Zora protocol</p>
          
          <div className="coin-config-grid">
            <div className="form-group">
              <label htmlFor="coinName">Coin Name</label>
              <input
                {...register('zoraCoin.name')}
                id="coinName"
                type="text"
                placeholder="My Awesome Coin"
                className="input"
              />
              <div className="field-hint">The full name of your coin</div>
            </div>

            <div className="form-group">
              <label htmlFor="coinSymbol">Symbol</label>
              <input
                {...register('zoraCoin.symbol')}
                id="coinSymbol"
                type="text"
                placeholder="MAC"
                className="input"
              />
              <div className="field-hint">Trading symbol (3-5 characters)</div>
            </div>

            <div className="form-group">
              <label htmlFor="metadataUri">Metadata URI</label>
              <input
                {...register('zoraCoin.uri')}
                id="metadataUri"
                type="url"
                placeholder="ipfs://..."
                className="input"
              />
              <div className="field-hint">IPFS URI for coin metadata (recommended)</div>
            </div>

            <div className="form-group">
              <label htmlFor="payoutRecipient">Payout Recipient</label>
              <input
                {...register('zoraCoin.payoutRecipient')}
                id="payoutRecipient"
                type="text"
                placeholder="0x..."
                className="input"
              />
              <div className="field-hint">Address that receives creator earnings</div>
            </div>

            <div className="form-group">
              <label htmlFor="platformReferrer">Platform Referrer (Optional)</label>
              <input
                {...register('zoraCoin.platformReferrer')}
                id="platformReferrer"
                type="text"
                placeholder="0x..."
                className="input"
              />
              <div className="field-hint">Address that earns referral fees</div>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Trading Currency</label>
              <select
                {...register('zoraCoin.currency')}
                id="currency"
                className="input"
              >
                <option value="ETH">ETH</option>
                <option value="ZORA">ZORA</option>
              </select>
              <div className="field-hint">Currency for trading pair (ZORA available on Base)</div>
            </div>

            <div className="form-group">
              <label htmlFor="chainId">Chain ID</label>
              <select
                {...register('zoraCoin.chainId')}
                id="chainId"
                className="input"
              >
                <option value={8453}>Base Mainnet (8453)</option>
                <option value={84532}>Base Sepolia (84532)</option>
              </select>
              <div className="field-hint">Blockchain network for deployment</div>
            </div>
          </div>
        </div>
        <div className="reward-types">
          <div className="reward-card">
            <div className="card-header">
              <label className="toggle-label">
                <input
                  {...register('nftRewards.enabled')}
                  type="checkbox"
                  className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">NFT Rewards</span>
              </label>
            </div>
            
            {nftEnabled && (
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="nftContract">NFT Contract Address</label>
                  <input
                    {...register('nftRewards.contractAddress')}
                    id="nftContract"
                    type="text"
                    placeholder="0x..."
                    className={`input ${errors.nftRewards?.contractAddress ? 'error' : ''}`}
                  />
                  {errors.nftRewards?.contractAddress && (
                    <span className="error-message">
                      {errors.nftRewards.contractAddress.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tokenId">Token ID (Optional)</label>
                  <input
                    {...register('nftRewards.tokenId')}
                    id="tokenId"
                    type="text"
                    placeholder="Leave empty for random selection"
                    className="input"
                  />
                  <div className="field-hint">
                    Specific token ID to mint, or leave empty for random
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="reward-card">
            <div className="card-header">
              <label className="toggle-label">
                <input
                  {...register('urlRewards.enabled')}
                  type="checkbox"
                  className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Exclusive URL Access</span>
              </label>
            </div>
            
            {urlEnabled && (
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="exclusiveUrl">Exclusive URL</label>
                  <input
                    {...register('urlRewards.exclusiveUrl')}
                    id="exclusiveUrl"
                    type="url"
                    placeholder="https://..."
                    className={`input ${errors.urlRewards?.exclusiveUrl ? 'error' : ''}`}
                  />
                  {errors.urlRewards?.exclusiveUrl && (
                    <span className="error-message">
                      {errors.urlRewards.exclusiveUrl.message}
                    </span>
                  )}
                  <div className="field-hint">
                    URL accessible only to token holders who meet conditions
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="reward-conditions">
          <h3>Reward Conditions</h3>
          <p>Set minimum requirements for users to receive rewards</p>
          
          <div className="conditions-grid">
            <div className="form-group">
              <label htmlFor="minHolding">Minimum Token Holding</label>
              <input
                {...register('conditions.minHolding')}
                id="minHolding"
                type="number"
                min="0"
                step="0.001"
                placeholder="0"
                className="input"
              />
              <div className="field-hint">
                Minimum number of tokens user must hold
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="minTradingVolume">Minimum Trading Volume</label>
              <input
                {...register('conditions.minTradingVolume')}
                id="minTradingVolume"
                type="number"
                min="0"
                step="0.001"
                placeholder="0"
                className="input"
              />
              <div className="field-hint">
                Minimum trading volume (in ETH) required
              </div>
            </div>
          </div>
        </div>

        <div className="reward-history">
          <h3>Reward History</h3>
          <div className="history-placeholder">
            <p>No rewards distributed yet</p>
            <p>Rewards will appear here once your settings are active</p>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" size="lg">
            Deploy Coin
          </Button>
          <Button type="submit" variant="primary" size="lg">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}