import { Project } from '@/types';

export const sampleProjects: Project[] = [
  {
    id: '1',
    slug: 'ai-powered-analytics-dashboard',
    title: 'AI-Powered Analytics Dashboard',
    subtitle: 'Real-time insights with predictive analytics',
    description: 'A cutting-edge analytics platform that leverages machine learning to provide predictive insights and real-time data visualization for business intelligence.',
    category: 'web-app',
    featured: true,
    priority: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',

    technical: {
      stack: ['React', 'TypeScript', 'Python', 'TensorFlow', 'D3.js', 'PostgreSQL'],
      features: [
        {
          name: 'Real-time Data Streaming',
          description: 'Live updates with sub-second latency',
          icon: 'activity'
        },
        {
          name: 'Predictive Analytics',
          description: 'ML-powered forecasting with 95% accuracy',
          icon: 'trending-up'
        },
        {
          name: 'Custom Visualizations',
          description: 'WebGL-accelerated interactive charts',
          icon: 'bar-chart'
        }
      ],
      liveUrl: 'https://analytics.example.com',
      performance: {
        lighthouse: {
          performance: 95,
          accessibility: 98,
          bestPractices: 100,
          seo: 100
        },
        webVitals: {
          lcp: 1.2,
          fid: 50,
          cls: 0.05
        },
        loadTime: 1.8
      }
    },
    showcase: {
      tier: 2,
      quickPreview: {
        type: 'video',
        mediaUrl: '/videos/analytics-preview.mp4',
        hookMessage: 'See AI predictions update in real-time'
      },
      standardShowcase: {
        template: 'business',
        demoUrl: 'https://demo.analytics.example.com',
        mobileStrategy: 'responsive'
      }
    },
    educational: {
      concepts: [
        {
          id: 'concept-1',
          name: 'Real-time Data Streaming',
          simpleExplanation: 'Updates that happen instantly as new information comes in'
        },
        {
          id: 'concept-2',
          name: 'Predictive Analytics',
          simpleExplanation: 'Using patterns to predict what might happen next'
        }
      ],
      comparisons: [
        {
          id: 'comparison-1',
          title: 'Traditional vs Real-time Analytics',
          traditional: {
            description: 'Daily batch processing with delayed insights',
            issues: ['Daily batch reports', 'Outdated insights', 'Reactive decisions'],
            metric: '24-48 hours'
          },
          modern: {
            description: 'Live streaming with instant updates',
            benefits: ['Live data updates', 'Instant insights', 'Proactive decisions'],
            metric: '<1 second'
          },
          businessImpact: '75% faster decision making, 40% increase in operational efficiency'
        }
      ],
      learningPath: ['concept-1', 'concept-2']
    },
    results: {
      metrics: [
        {
          label: 'Decision Speed',
          value: '75% faster',
          icon: 'trending-up'
        },
        {
          label: 'Data Processing',
          value: '1M+ points/min',
          icon: 'activity'
        },
        {
          label: 'ROI',
          value: '320% in 6 months',
          icon: 'dollar-sign'
        }
      ],
      testimonial: {
        content: 'This dashboard transformed how we make decisions. We now spot trends before they become problems.',
        author: 'Sarah Chen',
        role: 'VP of Operations',
        company: 'TechCorp Inc.'
      }
    },
    analytics: {
      views: 1250,
      engagement: {
        timeSpent: 240,
        interactions: 15,
        scrollDepth: 85,
        educationalEngagement: 90
      },
      conversion: {
        viewToLead: 12,
        leadToDiscovery: 45,
        discoveryToClient: 70
      }
    }
  },
  {
    id: '2',
    slug: 'interactive-learning-platform',
    title: 'Interactive Learning Platform',
    subtitle: 'Gamified education with real-time collaboration',
    description: 'An innovative e-learning platform that combines gamification, real-time collaboration, and adaptive learning paths to create engaging educational experiences.',
    category: 'interactive',
    featured: true,
    priority: 2,
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-10'),
    status: 'active',
    technical: {
      stack: ['Next.js', 'TypeScript', 'Socket.io', 'MongoDB', 'Three.js', 'Framer Motion'],
      features: [
        {
          name: 'Real-time Collaboration',
          description: 'Live code sharing and pair programming',
          icon: 'users'
        },
        {
          name: '3D Learning Experiences',
          description: 'Interactive 3D visualizations for complex concepts',
          icon: 'box'
        },
        {
          name: 'Adaptive Learning',
          description: 'AI-powered personalized learning paths',
          icon: 'brain'
        }
      ],
      liveUrl: 'https://learn.example.com',
      performance: {
        lighthouse: {
          performance: 92,
          accessibility: 100,
          bestPractices: 95,
          seo: 98
        },
        webVitals: {
          lcp: 1.5,
          fid: 75,
          cls: 0.08
        },
        loadTime: 2.1
      }
    },
    showcase: {
      tier: 2,
      quickPreview: {
        type: 'widget',
        component: 'InteractiveLearningWidget',
        hookMessage: 'Try an interactive learning exercise'
      },
      standardShowcase: {
        template: 'interactive',
        demoUrl: 'https://demo.learn.example.com',
        mobileStrategy: 'responsive'
      }
    },
    educational: {
      concepts: [
        {
          id: 'concept-3',
          name: 'Real-time Collaboration',
          simpleExplanation: 'Multiple people working on the same thing at the same time'
        },
        {
          id: 'concept-4',
          name: 'Gamification',
          simpleExplanation: 'Making learning feel like playing a game'
        }
      ],
      comparisons: [
        {
          id: 'comparison-2',
          title: 'Traditional vs Gamified Learning',
          traditional: {
            description: 'Passive lecture-based learning',
            issues: ['Boring lectures', 'Low engagement', 'High dropout rates'],
            metric: '60% completion'
          },
          modern: {
            description: 'Interactive game-based learning',
            benefits: ['Interactive experiences', 'Achievement systems', 'Social learning'],
            metric: '92% completion'
          },
          businessImpact: 'Higher completion rates lead to better customer lifetime value'
        }
      ],
      learningPath: ['concept-3', 'concept-4']
    },
    results: {
      metrics: [
        {
          label: 'Completion Rate',
          value: '94%',
          icon: 'award'
        },
        {
          label: 'User Engagement',
          value: '3x increase',
          icon: 'users'
        },
        {
          label: 'Learning Speed',
          value: '40% faster',
          icon: 'zap'
        }
      ],
      testimonial: {
        content: 'The platform transformed our training program. Engagement is through the roof!',
        author: 'Michael Torres',
        role: 'Head of Learning & Development',
        company: 'EduTech Solutions'
      }
    },
    analytics: {
      views: 980,
      engagement: {
        timeSpent: 320,
        interactions: 25,
        scrollDepth: 92,
        educationalEngagement: 95
      },
      conversion: {
        viewToLead: 15,
        leadToDiscovery: 50,
        discoveryToClient: 65
      }
    }
  },
  {
    id: '3',
    slug: 'smart-inventory-system',
    title: 'Smart Inventory Management',
    subtitle: 'AI-driven supply chain optimization',
    description: 'An intelligent inventory management system that uses predictive analytics to optimize stock levels, reduce waste, and automate reordering processes.',
    category: 'technical',
    featured: false,
    priority: 3,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-12-20'),
    status: 'active',
    technical: {
      stack: ['Vue.js', 'Node.js', 'Python', 'scikit-learn', 'PostgreSQL', 'Redis'],
      features: [
        {
          name: 'Demand Forecasting',
          description: 'ML-powered predictions with 95% accuracy',
          icon: 'trending-up'
        },
        {
          name: 'Real-time Tracking',
          description: 'Live inventory updates across all locations',
          icon: 'package'
        },
        {
          name: 'Automated Reordering',
          description: 'Smart procurement based on predictions',
          icon: 'refresh-cw'
        }
      ],
      liveUrl: 'https://inventory.example.com',
      performance: {
        lighthouse: {
          performance: 88,
          accessibility: 96,
          bestPractices: 93,
          seo: 95
        },
        webVitals: {
          lcp: 1.8,
          fid: 65,
          cls: 0.05
        },
        loadTime: 2.3
      }
    },
    showcase: {
      tier: 2,
      quickPreview: {
        type: 'carousel',
        mediaUrl: '/images/inventory-preview.jpg',
        hookMessage: 'Watch inventory optimize itself in real-time'
      },
      standardShowcase: {
        template: 'technical',
        demoUrl: 'https://demo.inventory.example.com',
        mobileStrategy: 'screenshots'
      }
    },
    educational: {
      concepts: [
        {
          id: 'concept-5',
          name: 'Predictive Analytics',
          simpleExplanation: 'Using past data to predict future needs'
        }
      ],
      comparisons: [
        {
          id: 'comparison-3',
          title: 'Manual vs AI-Powered Inventory',
          traditional: {
            description: 'Manual ordering based on gut feeling',
            issues: ['Overstocking', 'Stockouts', 'Wasted capital'],
            metric: '40% inventory waste'
          },
          modern: {
            description: 'AI-driven automated optimization',
            benefits: ['Just-in-time ordering', 'Optimal stock levels', 'Capital efficiency'],
            metric: '5% inventory waste'
          },
          businessImpact: '35% reduction in inventory costs with zero stockouts'
        }
      ],
      learningPath: ['concept-5']
    },
    results: {
      metrics: [
        {
          label: 'Inventory Costs',
          value: '45% reduction',
          icon: 'trending-down'
        },
        {
          label: 'Stockout Rate',
          value: '85% decrease',
          icon: 'check-circle'
        },
        {
          label: 'Efficiency',
          value: '3x faster',
          icon: 'activity'
        }
      ],
      testimonial: {
        content: 'Cut our inventory costs by 35% while eliminating stockouts completely.',
        author: 'David Park',
        role: 'Supply Chain Director',
        company: 'RetailMax Corp.'
      }
    },
    analytics: {
      views: 750,
      engagement: {
        timeSpent: 180,
        interactions: 12,
        scrollDepth: 78,
        educationalEngagement: 85
      },
      conversion: {
        viewToLead: 10,
        leadToDiscovery: 40,
        discoveryToClient: 60
      }
    }
  }
];
