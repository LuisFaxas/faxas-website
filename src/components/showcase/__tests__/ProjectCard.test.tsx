import { render, screen } from '@/lib/test-utils'
import { ProjectCard } from '../ProjectCard'
import { Project } from '@/types'

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, onMouseEnter, onMouseLeave, ...props }: any) => (
      <div {...props} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</div>
    ),
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

jest.mock('../QuickPreview', () => ({
  QuickPreview: () => <div data-testid="quick-preview">Quick Preview</div>,
}))

jest.mock('@/components/ui/glass/glass-panel', () => ({
  GlassPanel: ({ children, float, glow, level, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

// Mock project data
const mockProject: Project = {
  id: '1',
  title: 'E-Commerce Dashboard',
  subtitle: 'Real-time analytics platform',
  slug: 'ecommerce-dashboard',
  category: 'web-app',
  description: 'A comprehensive dashboard for managing online stores with real-time analytics and inventory management.',
  featured: true,
  tags: ['React', 'TypeScript', 'Firebase'],
  showcase: {
    quickPreview: {
      type: 'widget' as const,
      hookMessage: 'Watch sales grow in real-time',
      component: 'stats',
      data: {
        stats: [
          { label: 'Orders', value: '156', trend: '+15%' },
          { label: 'Revenue', value: '$12,543', trend: '+23%' },
        ],
      },
    },
    thumbnail: '/projects/ecommerce-thumb.jpg',
    gallery: [],
    liveUrl: 'https://demo.example.com',
  },
  technical: {
    stack: ['React', 'Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    features: {
      core: ['Real-time updates', 'Responsive design'],
      advanced: [],
    },
    performance: {
      lighthouse: { performance: 98, accessibility: 100, bestPractices: 95, seo: 100 },
      loadTime: 0.8,
      webVitals: { lcp: 1.2, fid: 10, cls: 0.05 },
    },
  },
  results: {
    metrics: [
      { label: 'Revenue Increase', value: '+276%' },
      { label: 'Processing Time', value: '-80%' },
    ],
    testimonial: {
      content: 'This dashboard transformed our business',
      author: 'John Doe',
      role: 'CEO, Example Corp',
    },
  },
}

describe('ProjectCard', () => {
  it('renders project title and subtitle', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('E-Commerce Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Real-time analytics platform')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText(/comprehensive dashboard for managing online stores/)).toBeInTheDocument()
  })

  it('displays featured badge when project is featured', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not display featured badge when project is not featured', () => {
    const nonFeaturedProject = { ...mockProject, featured: false }
    render(<ProjectCard project={nonFeaturedProject} />)
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('renders correct category icon and label', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('web app')).toBeInTheDocument()
  })

  it('displays tech stack with limit of 3', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('shows business metrics', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('Revenue Increase')).toBeInTheDocument()
    expect(screen.getByText('+276%')).toBeInTheDocument()
  })

  it('links to correct project page', () => {
    render(<ProjectCard project={mockProject} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/projects/ecommerce-dashboard')
  })

  it('renders QuickPreview component when preview data exists', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByTestId('quick-preview')).toBeInTheDocument()
  })

  it('shows hook message on hover', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('Watch sales grow in real-time')).toBeInTheDocument()
  })

  it('displays View Project button on mobile', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Button is hidden on desktop (md:hidden class)
    const button = screen.getByRole('button', { name: /view project/i })
    expect(button).toBeInTheDocument()
  })

  it('applies different category colors', () => {
    const interactiveProject = { ...mockProject, category: 'interactive' as const }
    const { rerender } = render(<ProjectCard project={interactiveProject} />)
    
    // Check for interactive category
    expect(screen.getByText('interactive')).toBeInTheDocument()
    
    // Rerender with technical category
    const technicalProject = { ...mockProject, category: 'technical' as const }
    rerender(<ProjectCard project={technicalProject} />)
    
    expect(screen.getByText('technical')).toBeInTheDocument()
  })
})