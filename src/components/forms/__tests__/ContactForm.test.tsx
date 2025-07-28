import { render, screen, waitFor } from '@/lib/test-utils'
import { ContactForm } from '../ContactForm'

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

jest.mock('@/components/ui/glass/glass-panel', () => ({
  GlassPanel: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, ...props }: any) => (
    <button disabled={disabled} {...props}>{children}</button>
  ),
}))

jest.mock('@/lib/firebase/leads', () => ({
  submitContactForm: jest.fn(),
}))

jest.mock('@/components/ui/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

import { submitContactForm } from '@/lib/firebase/leads'
import { toast } from '@/components/ui/toast'

const mockSubmitContactForm = submitContactForm as jest.MockedFunction<typeof submitContactForm>

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('displays validation errors for required fields', async () => {
    const { user } = render(<ContactForm />)
    
    // Submit without filling fields
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })


  it('submits form successfully with valid data', async () => {
    mockSubmitContactForm.mockResolvedValueOnce({ success: true })
    const onSuccess = jest.fn()
    const { user } = render(<ContactForm onSuccess={onSuccess} />)
    
    // Fill form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/company/i), 'Acme Inc')
    await user.type(screen.getByLabelText(/your message/i), 'This is a test message for the contact form')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Inc',
        message: 'This is a test message for the contact form',
      })
      expect(toast.success).toHaveBeenCalledWith('Message sent!', "I'll get back to you within 24 hours.")
      expect(onSuccess).toHaveBeenCalled()
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
    
    // Check form is reset
    expect(screen.getByLabelText(/your name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email address/i)).toHaveValue('')
    expect(screen.getByLabelText(/company/i)).toHaveValue('')
    expect(screen.getByLabelText(/your message/i)).toHaveValue('')
  })

  it('handles submission errors', async () => {
    const errorMessage = 'Network error occurred'
    mockSubmitContactForm.mockResolvedValueOnce({ success: false, error: errorMessage })
    
    const { user } = render(<ContactForm />)
    
    // Fill form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/your message/i), 'This is a test message')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send message', errorMessage)
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    mockSubmitContactForm.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    const { user } = render(<ContactForm />)
    
    // Fill form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/your message/i), 'This is a test message')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    // Check loading state
    expect(screen.getByText(/sending.../i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText(/send message/i)).toBeInTheDocument()
    })
  })

  it('company field is optional', async () => {
    mockSubmitContactForm.mockResolvedValueOnce({ success: true })
    const { user } = render(<ContactForm />)
    
    // Fill form without company
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/your message/i), 'This is a test message')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: '',
        message: 'This is a test message',
      })
    })
  })
})