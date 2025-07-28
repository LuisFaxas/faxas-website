import { render, screen } from '@/lib/test-utils'
import { Button } from '../button'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, transition, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

// Mock Ripple component
jest.mock('../ripple', () => ({
  Ripple: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies default variant and size classes', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole('button')
    
    // Should have primary variant classes
    expect(button).toHaveClass('text-white')
    expect(button).toHaveClass('bg-white/20')
    
    // Should have md size classes
    expect(button).toHaveClass('h-11')
    expect(button).toHaveClass('px-6')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-gray-900')
    expect(screen.getByRole('button')).toHaveClass('bg-white/60')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-gray-700')
    
    rerender(<Button variant="glass">Glass</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-white')
    
    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-14')
    
    rerender(<Button size="xl">Extra Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-16')
    
    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
    expect(screen.getByRole('button')).toHaveClass('w-10')
  })

  it('handles onClick events', async () => {
    const handleClick = jest.fn()
    const { user } = render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('custom-class')
    // Should still have default classes
    expect(button).toHaveClass('text-white')
  })

  it('handles different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    
    rerender(<Button type="reset">Reset</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
  })

  it('applies aria-label when provided', () => {
    render(<Button aria-label="Close dialog">X</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog')
  })

  it('wraps content in relative z-10 span', () => {
    render(<Button>Content</Button>)
    const contentSpan = screen.getByText('Content')
    expect(contentSpan).toHaveClass('relative')
    expect(contentSpan).toHaveClass('z-10')
  })
})