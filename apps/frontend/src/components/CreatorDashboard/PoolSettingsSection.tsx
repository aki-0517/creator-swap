import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { poolSettingsSchema } from '../../schemas/dashboard'
import type { PoolSettingsData } from '../../types/dashboard'
import { Button } from '../Button/Button'

export const PoolSettingsSection = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PoolSettingsData>({
    resolver: zodResolver(poolSettingsSchema),
    defaultValues: {
      initialLiquidity: '',
      feeRate: 0.3,
      poolStatus: 'none'
    }
  })

  const poolStatus = watch('poolStatus')
  const feeRate = watch('feeRate')

  const onSubmit = (data: PoolSettingsData) => {
    console.log('Pool settings data:', data)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return '#10b981'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Pool Active'
      case 'pending': return 'Pool Pending'
      default: return 'No Pool'
    }
  }

  return (
    <div className="pool-settings-section">
      <div className="section-header">
        <h2>Pool Settings</h2>
        <p>Configure your Uniswap V4 pool parameters and manage liquidity</p>
      </div>

      <div className="pool-status-card">
        <div className="status-indicator">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getStatusColor(poolStatus) }}
          />
          <span className="status-text">{getStatusText(poolStatus)}</span>
        </div>
        {poolStatus === 'created' && (
          <div className="pool-info">
            <p>Pool Address: 0x1234...5678</p>
            <p>Total Liquidity: $12,345</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pool-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="initialLiquidity">Initial Liquidity (ETH) *</label>
            <input
              {...register('initialLiquidity')}
              id="initialLiquidity"
              type="number"
              step="0.001"
              placeholder="1.0"
              className={`input ${errors.initialLiquidity ? 'error' : ''}`}
            />
            {errors.initialLiquidity && (
              <span className="error-message">{errors.initialLiquidity.message}</span>
            )}
            <div className="field-hint">
              Amount of ETH to provide as initial liquidity
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feeRate">Trading Fee Rate (%)</label>
            <input
              {...register('feeRate', { valueAsNumber: true })}
              id="feeRate"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              className={`input ${errors.feeRate ? 'error' : ''}`}
            />
            {errors.feeRate && (
              <span className="error-message">{errors.feeRate.message}</span>
            )}
            <div className="field-hint">
              Current: {feeRate}% • Range: 0.01% - 1%
            </div>
          </div>
        </div>

        <div className="fee-distribution-info">
          <h3>Fee Distribution</h3>
          <div className="distribution-breakdown">
            <div className="breakdown-item">
              <span className="percentage">80%</span>
              <span className="description">Fee Receivers</span>
            </div>
            <div className="breakdown-item">
              <span className="percentage">20%</span>
              <span className="description">Automated Buybacks</span>
            </div>
          </div>
        </div>

        <div className="pool-actions">
          {poolStatus === 'none' && (
            <Button type="submit" variant="primary" size="lg">
              Create Pool
            </Button>
          )}
          {poolStatus === 'created' && (
            <div className="action-buttons">
              <Button type="button" variant="outline" size="md">
                Add Liquidity
              </Button>
              <Button type="button" variant="outline" size="md">
                Remove Liquidity
              </Button>
              <Button type="submit" variant="secondary" size="md">
                Update Settings
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}