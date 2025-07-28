import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types';

const sampleProject: Project = {
  id: '1',
  slug: 'ecommerce-platform',
  status: 'active',
  title: 'E-Commerce Platform',
  subtitle: 'Modern Shopping Experience',
  description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory management, secure payment processing, and a responsive design that increased conversions by 45%.',
  category: 'web-app',
  featured: true,
  priority: 1,
  showcase: {
    tier: 1,
    quickPreview: {
      type: 'widget',
      hookMessage: 'See real-time inventory updates in action',
    },
    standardShowcase: {
      template: 'business',
      demoUrl: 'https://demo.example.com',
      mobileStrategy: 'responsive',
    },
  },
  technical: {
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
    features: [
      { name: 'Real-time Inventory', description: 'Live stock updates across all channels' },
      { name: 'Secure Payments', description: 'PCI-compliant payment processing' },
    ],
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/example/ecommerce',
    performance: {
      lighthouse: {
        performance: 98,
        accessibility: 100,
        bestPractices: 95,
        seo: 100,
      },
      webVitals: {
        lcp: 0.8,
        fid: 10,
        cls: 0.01,
      },
      loadTime: 0.8,
    },
  },
  results: {
    metrics: [
      { label: 'Conversion Rate', value: '+45%', icon: 'TrendingUp' },
      { label: 'Load Time', value: '0.8s', icon: 'Zap' },
      { label: 'Mobile Score', value: '98/100', icon: 'Smartphone' },
    ],
  },
  educational: {
    concepts: [],
    comparisons: [],
    learningPath: [],
  },
  analytics: {
    views: 1250,
    engagement: {
      timeSpent: 180,
      interactions: 25,
      scrollDepth: 85,
      educationalEngagement: 65,
    },
    conversion: {
      viewToLead: 12,
      leadToDiscovery: 45,
      discoveryToClient: 25,
    },
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

const meta = {
  title: 'Showcase/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    project: {
      description: 'The project data to display',
    },
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variations
export const Default: Story = {
  args: {
    project: sampleProject,
  },
};

export const FeaturedProject: Story = {
  args: {
    project: {
      ...sampleProject,
      featured: true,
      title: 'Featured: AI-Powered Analytics Dashboard',
      description: 'An innovative analytics platform that leverages machine learning to provide predictive insights and automated reporting.',
    },
  },
};

export const MinimalProject: Story = {
  args: {
    project: {
      ...sampleProject,
      technical: {
        ...sampleProject.technical,
        liveUrl: undefined,
        githubUrl: undefined,
        stack: ['React', 'Node.js'],
      },
    },
  },
};

// Different categories
export const WebAppProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Task Management App',
      category: 'web-app',
      description: 'A collaborative task management application with real-time updates, team workflows, and advanced analytics.',
      technical: {
        ...sampleProject.technical,
        performance: {
          ...sampleProject.technical.performance,
          lighthouse: {
            ...sampleProject.technical.performance.lighthouse,
            performance: 96,
          },
          loadTime: 1.2,
        },
      },
      results: {
        ...sampleProject.results,
        metrics: [
          { label: 'Performance', value: '96/100', icon: 'Gauge' },
          { label: 'Load Time', value: '1.2s', icon: 'Clock' },
          { label: 'Improvement', value: '+150%', icon: 'TrendingUp' },
        ],
      },
    },
  },
};

export const PortfolioProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Creative Portfolio',
      category: 'interactive',
      description: 'A stunning portfolio website showcasing creative work with smooth animations and an immersive user experience.',
      technical: {
        ...sampleProject.technical,
        stack: ['Next.js', 'Framer Motion', 'Three.js'],
      },
    },
  },
};

export const CorporateProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Corporate Website',
      category: 'technical',
      description: 'A professional corporate website with multi-language support, CMS integration, and enterprise-grade security.',
      technical: {
        ...sampleProject.technical,
        stack: ['Next.js', 'Contentful', 'i18n'],
      },
    },
  },
};

// Performance variations
export const HighPerformance: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Ultra-Fast Blog Platform',
      technical: {
        ...sampleProject.technical,
        performance: {
          ...sampleProject.technical.performance,
          lighthouse: {
            ...sampleProject.technical.performance.lighthouse,
            performance: 100,
          },
          loadTime: 0.4,
        },
      },
      results: {
        ...sampleProject.results,
        metrics: [
          { label: 'Performance', value: '100/100', icon: 'Star' },
          { label: 'Load Time', value: '0.4s', icon: 'Zap' },
          { label: 'Improvement', value: '+380%', icon: 'Rocket' },
        ],
      },
    },
  },
};

export const ImprovedPerformance: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Optimized News Portal',
      technical: {
        ...sampleProject.technical,
        performance: {
          ...sampleProject.technical.performance,
          lighthouse: {
            ...sampleProject.technical.performance.lighthouse,
            performance: 85,
          },
          loadTime: 1.8,
        },
      },
      results: {
        ...sampleProject.results,
        metrics: [
          { label: 'Performance', value: '85/100', icon: 'Gauge' },
          { label: 'Load Time', value: '1.8s', icon: 'Clock' },
          { label: 'Improvement', value: '+125%', icon: 'TrendingUp' },
        ],
      },
    },
  },
};

// State variations
export const Loading: Story = {
  args: {
    project: sampleProject,
  },
  render: () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-64 w-96 mb-4"></div>
      <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-full rounded"></div>
    </div>
  ),
};

// Grid showcase
export const ProjectGrid: Story = {
  args: {
    project: sampleProject,
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      <ProjectCard
        project={{
          ...sampleProject,
          title: 'E-Commerce Platform',
          category: 'web-app',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '2',
          title: 'SaaS Dashboard',
          category: 'web-app',
          featured: true,
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '3',
          title: 'Marketing Website',
          category: 'technical',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '4',
          title: 'Mobile App Landing',
          category: 'interactive',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '5',
          title: 'Developer Portfolio',
          category: 'interactive',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '6',
          title: 'Blog Platform',
          category: 'web-app',
        }}
      />
    </div>
  ),
};

// Interactive example
export const InteractiveCard: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Interactive Demo Project',
      description: 'Hover over this card to see the smooth animations and transitions. Click to view project details.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'This card demonstrates all interactive states including hover effects and click interactions.',
      },
    },
  },
};