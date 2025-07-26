export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  slug: string;
  category: string;
  techStack: string[];
  features?: string[];
  demoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  images: string[];
  status: 'completed' | 'in-progress' | 'concept';
  featured?: boolean;
  testimonial?: {
    client: string;
    role: string;
    content: string;
  };
  metrics?: {
    desktop: number;
    mobile: number;
  };
  loadTime?: string;
  mobileOptimized?: boolean;
}

export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    category: 'Web Application',
    description: 'Real-time inventory management with instant updates',
    longDescription: 'A modern e-commerce dashboard built with React and Firebase, featuring real-time inventory tracking, order management, and analytics.',
    techStack: ['React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
    features: [
      'Real-time inventory updates',
      'Order tracking and management',
      'Customer analytics dashboard',
      'Mobile-responsive design'
    ],
    demoUrl: '/demos/ecommerce',
    liveUrl: 'https://demo.faxas.net/ecommerce',
    images: ['/images/projects/ecommerce-1.jpg', '/images/projects/ecommerce-2.jpg'],
    status: 'completed',
    featured: true,
    metrics: { desktop: 98, mobile: 95 },
    loadTime: '0.6s',
    mobileOptimized: true,
    testimonial: {
      client: 'Sarah Chen',
      role: 'CEO, TechStyle Boutique',
      content: 'The dashboard transformed how we manage inventory. Real-time updates saved us hours daily!'
    }
  },
  {
    id: '2',
    title: 'Booking Platform',
    slug: 'booking-platform',
    category: 'SaaS Platform',
    description: 'Seamless appointment scheduling with calendar integration',
    longDescription: 'A comprehensive booking system with calendar integration, automated reminders, and payment processing.',
    techStack: ['Next.js', 'PostgreSQL', 'Stripe API', 'Node.js'],
    features: [
      'Calendar synchronization',
      'Automated email reminders',
      'Payment integration',
      'Multi-timezone support'
    ],
    demoUrl: '/demos/booking',
    videoUrl: '/videos/booking-demo.mp4',
    images: ['/images/projects/booking-1.jpg', '/images/projects/booking-2.jpg'],
    status: 'completed',
    featured: true,
    metrics: { desktop: 96, mobile: 94 },
    loadTime: '0.8s',
    mobileOptimized: true
  },
  {
    id: '3',
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    category: 'Data Visualization',
    description: 'Interactive data visualization with real-time updates',
    longDescription: 'A powerful analytics platform with customizable dashboards, real-time data streaming, and advanced visualization options.',
    techStack: ['React', 'D3.js', 'WebSockets', 'Python'],
    features: [
      'Real-time data streaming',
      'Custom chart builders',
      'Export functionality',
      'Team collaboration'
    ],
    demoUrl: '/demos/analytics',
    images: ['/images/projects/analytics-1.jpg'],
    status: 'completed',
    metrics: { desktop: 97, mobile: 93 },
    loadTime: '0.7s',
    mobileOptimized: true
  }
];

export const liveProjects = [
  {
    title: "E-Commerce Dashboard",
    description: "Real-time inventory management with instant updates",
    demoUrl: "/demos/ecommerce", // We'll create these demo pages later
    videoUrl: "/videos/ecommerce-demo.mp4",
    loadTime: "0.6s",
    techStack: ["React", "Firebase", "Tailwind CSS"],
    metrics: { desktop: 98, mobile: 95 },
    mobileOptimized: true
  },
  {
    title: "Booking Platform",
    description: "Seamless appointment scheduling with calendar integration",
    demoUrl: "/demos/booking",
    videoUrl: "/videos/booking-demo.mp4",
    loadTime: "0.8s",
    techStack: ["Next.js", "PostgreSQL", "Stripe API"],
    metrics: { desktop: 96, mobile: 94 },
    mobileOptimized: true
  },
  {
    title: "Analytics Dashboard",
    description: "Interactive data visualization with real-time updates",
    demoUrl: "/demos/analytics",
    videoUrl: "/videos/analytics-demo.mp4",
    loadTime: "0.7s",
    techStack: ["React", "D3.js", "WebSockets"],
    metrics: { desktop: 97, mobile: 93 },
    mobileOptimized: true
  }
];

export const clientResults = [
  {
    name: "Sarah's Boutique",
    industry: "E-Commerce",
    before: "$2,400/mo",
    after: "$8,900/mo",
    increase: "271%",
    quote: "My checkout is so fast now, impulse buys went through the roof!",
    metrics: {
      pageSpeed: { before: 4.2, after: 0.8 },
      bounceRate: { before: "68%", after: "23%" },
      conversion: { before: "1.3%", after: "4.8%" }
    }
  },
  {
    name: "Mike's Gym",
    industry: "Fitness",
    before: "12 signups",
    after: "47 signups",
    increase: "292%",
    quote: "The booking system is instant. Members love it!",
    metrics: {
      pageSpeed: { before: 5.1, after: 0.9 },
      mobileUsage: { before: "45%", after: "78%" },
      retention: { before: "60%", after: "85%" }
    }
  },
  {
    name: "Tech Solutions Inc",
    industry: "B2B Software",
    before: "3% conversion",
    after: "11% conversion",
    increase: "267%",
    quote: "Our demos load instantly. Game changer for sales.",
    metrics: {
      pageSpeed: { before: 6.3, after: 0.7 },
      demoCompletion: { before: "32%", after: "89%" },
      leadQuality: { before: "Low", after: "High" }
    }
  }
];