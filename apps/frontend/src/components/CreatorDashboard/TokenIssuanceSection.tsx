import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tokenIssuanceFormSchema } from '../../schemas/dashboard'
import type { TokenIssuanceData } from '../../types/dashboard'
import { ImageUpload } from './ImageUpload'
import { FeeReceivers } from './FeeReceivers'
import { Button } from '../Button/Button'
import { useState } from 'react'

type TokenFormData = Omit<TokenIssuanceData, 'image'>

export const TokenIssuanceSection = () => {
  const [image, setImage] = useState<File | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<TokenFormData>({
    resolver: zodResolver(tokenIssuanceFormSchema),
    defaultValues: {
      ticker: '',
      coinName: '',
      description: '',
      feeReceivers: []
    }
  })

  const description = watch('description')
  const feeReceivers = watch('feeReceivers')

  const onSubmit = (data: TokenFormData) => {
    console.log('Token issuance data:', { ...data, image })
  }

  return (
    <div className="token-issuance-section">
      <div className="section-header">
        <h2>Token Issuance</h2>
        <p>Configure your creator token details and fee distribution</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="token-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="image">Token Image</label>
            <ImageUpload
              onImageSelect={setImage}
              selectedImage={image}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticker">Ticker *</label>
            <input
              {...register('ticker')}
              id="ticker"
              type="text"
              placeholder="BTC"
              className={`input ${errors.ticker ? 'error' : ''}`}
            />
            {errors.ticker && (
              <span className="error-message">{errors.ticker.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="coinName">Coin Name *</label>
            <input
              {...register('coinName')}
              id="coinName"
              type="text"
              placeholder="My Creator Token"
              className={`input ${errors.coinName ? 'error' : ''}`}
            />
            {errors.coinName && (
              <span className="error-message">{errors.coinName.message}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              {...register('description')}
              id="description"
              placeholder="Describe your token and its purpose..."
              rows={4}
              className={`textarea ${errors.description ? 'error' : ''}`}
            />
            <div className="character-count">
              {description?.length || 0}/255
            </div>
            {errors.description && (
              <span className="error-message">{errors.description.message}</span>
            )}
          </div>
        </div>

        <div className="fee-receivers-section">
          <div className="section-header">
            <h3>Fee Receivers</h3>
            <p>Fee receivers earn 80% of the trading fees, while the remaining 20% goes to automated buybacks.</p>
          </div>

          <FeeReceivers
            control={control}
            setValue={(name, value) => setValue(name as any, value)}
            feeReceivers={feeReceivers}
            errors={errors.feeReceivers}
          />
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" size="lg">
            Issue Token
          </Button>
        </div>
      </form>
    </div>
  )
}