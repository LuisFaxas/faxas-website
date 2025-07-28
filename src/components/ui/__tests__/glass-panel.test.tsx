import { render } from '@/lib/test-utils'
import { GlassPanel } from '../glass-panel'

describe('GlassPanel', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <GlassPanel>
        <p>Test content</p>
      </GlassPanel>
    )
    
    expect(getByText('Test content')).toBeInTheDocument()
  })

  it('applies primary class by default', () => {
    const { container } = render(
      <GlassPanel>Content</GlassPanel>
    )
    
    const panel = container.firstChild
    expect(panel).toHaveClass('glass-primary')
  })

  it('applies correct level classes', () => {
    const { container: primaryContainer } = render(
      <GlassPanel level="primary">Primary</GlassPanel>
    )
    const { container: secondaryContainer } = render(
      <GlassPanel level="secondary">Secondary</GlassPanel>
    )
    const { container: accentContainer } = render(
      <GlassPanel level="accent">Accent</GlassPanel>
    )
    
    expect(primaryContainer.firstChild).toHaveClass('glass-primary')
    expect(secondaryContainer.firstChild).toHaveClass('glass-secondary')
    expect(accentContainer.firstChild).toHaveClass('glass-accent')
  })

  it('applies floating styles when float prop is true', () => {
    const { container } = render(
      <GlassPanel float>Floating content</GlassPanel>
    )
    
    const panel = container.firstChild
    expect(panel).toHaveClass('floating-tile')
    expect(panel).toHaveClass('hover:shadow-glass-hover')
  })

  it('merges custom className', () => {
    const { container } = render(
      <GlassPanel className="custom-class">Content</GlassPanel>
    )
    
    const panel = container.firstChild
    expect(panel).toHaveClass('custom-class')
    expect(panel).toHaveClass('glass-primary') // Should still have default class
  })

  it('renders glass shine effect', () => {
    const { container } = render(
      <GlassPanel>Content</GlassPanel>
    )
    
    const shineEffect = container.querySelector('.absolute.inset-0')
    expect(shineEffect).toBeInTheDocument()
    expect(shineEffect).toHaveClass('pointer-events-none')
  })
})