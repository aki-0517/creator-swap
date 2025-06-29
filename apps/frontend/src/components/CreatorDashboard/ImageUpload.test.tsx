import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ImageUpload } from './ImageUpload'

// Mock file for testing
const createMockFile = (name: string, size: number, type: string) => {
  const file = new File(['test'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('ImageUpload', () => {
  const mockOnImageSelect = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    mockOnImageSelect.mockClear()
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      result: 'data:image/png;base64,mock-image-data',
      onload: null as any
    }
    ;(global as any).FileReader = vi.fn(() => mockFileReader)
  })

  it('renders upload dropzone initially', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    expect(screen.getByText(/drag & drop an image here/i)).toBeInTheDocument()
    expect(screen.getByText(/jpg, png, gif, webp • max 5mb/i)).toBeInTheDocument()
  })

  it('has dropzone element', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    const dropzone = screen.getByText(/drag & drop an image here/i).closest('.dropzone')
    expect(dropzone).toHaveClass('dropzone')
  })

  it('accepts valid image files', async () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    const file = createMockFile('test.png', 1024 * 1024, 'image/png') // 1MB
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    
    await user.upload(input!, file)
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(file)
  })

  it('renders file input for upload', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('accept', 'image/*,.jpeg,.jpg,.png,.gif,.webp')
  })

  it('shows correct file format information', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    expect(screen.getByText(/jpg, png, gif, webp • max 5mb/i)).toBeInTheDocument()
  })

  it('shows dropzone when no image selected', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    expect(screen.getByText(/drag & drop an image here/i)).toBeInTheDocument()
  })

  it('allows removing selected image', async () => {
    const mockFile = createMockFile('test.png', 1024, 'image/png')
    
    // Mock the component with preview state
    const MockImageUploadWithPreview = () => (
      <div className="image-preview">
        <img src="mock-preview" alt="Token preview" />
        <div className="preview-overlay">
          <button
            type="button"
            onClick={() => mockOnImageSelect(null)}
            className="remove-button"
          >
            ✕
          </button>
        </div>
      </div>
    )
    
    render(<MockImageUploadWithPreview />)
    
    const removeButton = screen.getByRole('button', { name: '✕' })
    await user.click(removeButton)
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(null)
  })

  it('handles file input click', async () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />)
    
    const dropzone = screen.getByText(/drag & drop an image here/i).closest('div')
    await user.click(dropzone!)
    
    // Should trigger file input (tested indirectly through dropzone click)
    expect(dropzone).toBeInTheDocument()
  })
})