import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types/project';

const sampleProject: Project = {
  id: '1',
  title: 'E-Commerce Platform',
  slug: 'ecommerce-platform',
  description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory management, secure payment processing, and a responsive design that increased conversions by 45%.',
  category: 'E-Commerce',
  featured: true,
  image: '/placeholder-ecommerce.jpg',
  images: ['/placeholder-ecommerce.jpg', '/placeholder-dashboard.jpg'],
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
  liveUrl: 'https://example-ecommerce.com',
  githubUrl: 'https://github.com/example/ecommerce',
  metrics: {
    performanceScore: {
      desktop: 98,
      mobile: 95,
    },
    loadTime: 0.8,
    improvement: 276,
  },
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
      liveUrl: undefined,
      githubUrl: undefined,
      metrics: undefined,
      techStack: ['React', 'Node.js'],
    },
  },
};

// Different categories
export const WebAppProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Task Management App',
      category: 'Web App',
      description: 'A collaborative task management application with real-time updates, team workflows, and advanced analytics.',
      metrics: {
        performanceScore: { desktop: 96, mobile: 92 },
        loadTime: 1.2,
        improvement: 150,
      },
    },
  },
};

export const PortfolioProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Creative Portfolio',
      category: 'Portfolio',
      description: 'A stunning portfolio website showcasing creative work with smooth animations and an immersive user experience.',
      techStack: ['Next.js', 'Framer Motion', 'Three.js'],
    },
  },
};

export const CorporateProject: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Corporate Website',
      category: 'Corporate',
      description: 'A professional corporate website with multi-language support, CMS integration, and enterprise-grade security.',
      techStack: ['Next.js', 'Contentful', 'i18n'],
    },
  },
};

// Performance variations
export const HighPerformance: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Ultra-Fast Blog Platform',
      metrics: {
        performanceScore: { desktop: 100, mobile: 99 },
        loadTime: 0.4,
        improvement: 380,
      },
    },
  },
};

export const ImprovedPerformance: Story = {
  args: {
    project: {
      ...sampleProject,
      title: 'Optimized News Portal',
      metrics: {
        performanceScore: { desktop: 85, mobile: 80 },
        loadTime: 1.8,
        improvement: 125,
      },
    },
  },
};

// State variations
export const Loading: Story = {
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
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      <ProjectCard
        project={{
          ...sampleProject,
          title: 'E-Commerce Platform',
          category: 'E-Commerce',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '2',
          title: 'SaaS Dashboard',
          category: 'Web App',
          featured: true,
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '3',
          title: 'Marketing Website',
          category: 'Corporate',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '4',
          title: 'Mobile App Landing',
          category: 'Landing Page',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '5',
          title: 'Developer Portfolio',
          category: 'Portfolio',
        }}
      />
      <ProjectCard
        project={{
          ...sampleProject,
          id: '6',
          title: 'Blog Platform',
          category: 'Web App',
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