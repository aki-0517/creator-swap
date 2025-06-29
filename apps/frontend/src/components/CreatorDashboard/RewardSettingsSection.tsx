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
        <h2>Reward Settings</h2>
        <p>Configure NFT rewards and exclusive content for your token holders</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="reward-form">
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
          <Button type="submit" variant="primary" size="lg">
            Save Reward Settings
          </Button>
        </div>
      </form>
    </div>
  )
}