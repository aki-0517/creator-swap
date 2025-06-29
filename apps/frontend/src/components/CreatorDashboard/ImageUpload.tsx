import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  selectedImage: File | null
}

export const ImageUpload = ({ onImageSelect, selectedImage: _ }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 5MB')
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please select a valid image file (JPG, PNG, GIF, WebP)')
      } else {
        setError('Invalid file')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onImageSelect(file)
      
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  })

  const removeImage = () => {
    onImageSelect(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="image-upload">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">📸</div>
            {isDragActive ? (
              <p>Drop your image here...</p>
            ) : (
              <>
                <p>Drag & drop an image here, or click to select</p>
                <p className="file-info">JPG, PNG, GIF, WebP • Max 5MB</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <img src={preview} alt="Token preview" />
          <div className="preview-overlay">
            <button
              type="button"
              onClick={removeImage}
              className="remove-button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}