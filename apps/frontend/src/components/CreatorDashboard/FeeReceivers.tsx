import { useFieldArray, type Control } from 'react-hook-form'
import { Button } from '../Button/Button'
import type { FeeReceiver } from '../../types/dashboard'
import { useState, useRef } from 'react'
import Papa from 'papaparse'

interface FeeReceiversProps {
  control: Control<any>
  setValue: (name: string, value: any) => void
  feeReceivers: FeeReceiver[]
  errors?: any
}

export const FeeReceivers = ({ control, setValue, feeReceivers, errors }: FeeReceiversProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feeReceivers'
  })

  const [csvError, setCsvError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addReceiver = () => {
    append({
      id: Date.now().toString(),
      address: '',
      share: 0
    })
  }

  const splitEvenly = () => {
    if (fields.length === 0) return
    
    const sharePerReceiver = 100 / fields.length
    const updatedReceivers = fields.map((field, index) => ({
      ...field,
      share: index === fields.length - 1 
        ? 100 - (sharePerReceiver * (fields.length - 1)) // Last receiver gets remainder
        : sharePerReceiver
    }))
    
    setValue('feeReceivers', updatedReceivers)
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCsvError(null)

    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          const receivers: FeeReceiver[] = []
          
          results.data.forEach((row: any, index: number) => {
            if (row.length < 2) return
            
            const address = row[0]?.trim()
            const shareStr = row[1]?.trim()
            
            if (!address || !shareStr) return
            
            const share = parseFloat(shareStr)
            if (isNaN(share) || share < 0 || share > 100) {
              throw new Error(`Invalid share value at row ${index + 1}: ${shareStr}`)
            }
            
            receivers.push({
              id: `csv-${index}-${Date.now()}`,
              address,
              share
            })
          })

          if (receivers.length === 0) {
            throw new Error('No valid receivers found in CSV')
          }

          const totalShare = receivers.reduce((sum, r) => sum + r.share, 0)
          if (Math.abs(totalShare - 100) > 0.01) {
            throw new Error(`Total share must equal 100%, got ${totalShare}%`)
          }

          setValue('feeReceivers', receivers)
        } catch (error) {
          setCsvError(error instanceof Error ? error.message : 'Failed to parse CSV')
        }
      },
      error: (error) => {
        setCsvError(`CSV parsing error: ${error.message}`)
      }
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const totalShare = feeReceivers.reduce((sum, receiver) => sum + receiver.share, 0)

  return (
    <div className="fee-receivers">
      <div className="receivers-header">
        <div className="receivers-count">
          {fields.length}/100 receivers
        </div>
        <div className="receivers-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Import CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={splitEvenly}
            disabled={fields.length === 0}
          >
            Split Evenly
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addReceiver}
          >
            Add Receiver
          </Button>
        </div>
      </div>

      {csvError && (
        <div className="error-message">{csvError}</div>
      )}

      <div className="csv-format-hint">
        CSV format: Address/ENS,Share(%)
      </div>

      {fields.length > 0 && (
        <>
          <div className="receivers-list">
            {fields.map((field, index) => (
              <div key={field.id} className="receiver-item">
                <div className="receiver-fields">
                  <div className="field-group">
                    <label>Address/ENS</label>
                    <input
                      {...control.register(`feeReceivers.${index}.address` as const)}
                      placeholder="0x... or name.eth"
                      className="input"
                    />
                  </div>
                  <div className="field-group">
                    <label>Share (%)</label>
                    <input
                      {...control.register(`feeReceivers.${index}.share` as const, {
                        valueAsNumber: true
                      })}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0"
                      className="input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="remove-receiver"
                  >
                    ✕
                  </button>
                </div>
                {errors?.[index] && (
                  <div className="receiver-errors">
                    {errors[index].address && (
                      <span className="error-message">{errors[index].address.message}</span>
                    )}
                    {errors[index].share && (
                      <span className="error-message">{errors[index].share.message}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="share-summary">
            <div className="share-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(totalShare, 100)}%` }}
                />
              </div>
              <div className={`share-total ${totalShare !== 100 ? 'invalid' : 'valid'}`}>
                {totalShare.toFixed(2)}% / 100%
              </div>
            </div>
            {Math.abs(totalShare - 100) > 0.01 && (
              <div className="error-message">
                Total share must equal 100%
              </div>
            )}
          </div>
        </>
      )}

      {fields.length === 0 && (
        <div className="empty-state">
          <p>No fee receivers added yet.</p>
          <p>Click "Add Receiver" to get started, or import from CSV.</p>
        </div>
      )}

      <div className="fee-tip">
        <strong>Tip:</strong> Fee receivers can log into Flaunch with their social account to claim fees
      </div>
    </div>
  )
}