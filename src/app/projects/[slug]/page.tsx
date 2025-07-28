import { notFound } from 'next/navigation';
import ProjectPageClient from './ProjectPageClient';

// Complete project data with all details
const projectsData = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    category: 'Web Application',
    description: 'Real-time inventory management system with advanced analytics and reporting',
    longDescription: `A comprehensive e-commerce management platform built for modern online retailers. This dashboard provides real-time inventory tracking, sales analytics, customer insights, and automated reporting features. 
    
    The platform helped our client increase operational efficiency by 276% and reduce inventory management time by 80%. Built with performance and scalability in mind, it handles thousands of concurrent users and millions of products without breaking a sweat.`,
    techStack: ['React', 'Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    features: [
      'Real-time inventory updates with WebSocket integration',
      'Advanced analytics dashboard with customizable KPIs',
      'Automated low-stock alerts and reorder suggestions',
      'Multi-warehouse management capabilities',
      'Integrated payment processing and reconciliation',
      'Customer behavior tracking and insights'
    ],
    liveUrl: 'https://demo.faxas.net/ecommerce',
    demoUrl: '/demos/ecommerce',
    githubUrl: 'https://github.com/faxas/ecommerce-dashboard',
    images: [
      '/projects/ecommerce-1.jpg',
      '/projects/ecommerce-2.jpg',
      '/projects/ecommerce-3.jpg'
    ],
    metrics: {
      desktop: 98,
      mobile: 95,
      loadTime: 0.9,
      improvement: 276
    },
    testimonial: {
      content: 'The dashboard transformed our operations. We went from managing inventory in spreadsheets to having real-time insights across all our warehouses. Simply game-changing!',
      client: 'Sarah Johnson',
      role: 'CEO, Fashion Forward Inc.'
    },
    results: {
      engagementIncrease: '+156%',
      performanceGain: '276%',
      timeReduction: '80%',
      roi: '425%'
    },
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: '2',
    title: 'Healthcare Portal',
    slug: 'healthcare-portal',
    category: 'Healthcare',
    description: 'HIPAA-compliant patient management system with telemedicine capabilities',
    longDescription: `A secure, HIPAA-compliant healthcare platform that revolutionizes patient care. This portal integrates appointment scheduling, telemedicine, electronic health records, and billing into one seamless experience.
    
    The platform has helped healthcare providers reduce no-shows by 40% and increase patient satisfaction scores by 92%. Built with security and privacy at its core, it ensures patient data is protected while providing healthcare professionals with the tools they need.`,
    techStack: ['React', 'Node.js', 'PostgreSQL', 'WebRTC', 'AWS'],
    features: [
      'Secure video consultations with WebRTC',
      'Electronic health records management',
      'Automated appointment reminders',
      'Prescription management system',
      'Insurance verification and billing',
      'Patient portal with test results'
    ],
    liveUrl: 'https://demo.faxas.net/healthcare',
    demoUrl: '/demos/healthcare',
    images: [
      '/projects/healthcare-1.jpg',
      '/projects/healthcare-2.jpg'
    ],
    metrics: {
      desktop: 96,
      mobile: 94,
      loadTime: 1.2,
      improvement: 185
    },
    testimonial: {
      content: 'This portal has revolutionized how we interact with patients. The telemedicine feature alone has expanded our reach tremendously.',
      client: 'Dr. Michael Chen',
      role: 'Medical Director, HealthFirst Clinic'
    },
    results: {
      engagementIncrease: '+92%',
      performanceGain: '185%',
      timeReduction: '60%',
      roi: '380%'
    },
    gradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    id: '3',
    title: 'Learning Management System',
    slug: 'learning-platform',
    category: 'Education',
    description: 'AI-powered education platform with personalized learning paths',
    longDescription: `An innovative learning management system that uses AI to create personalized education experiences. The platform adapts to each student's learning style, pace, and preferences to maximize educational outcomes.
    
    Schools using our platform have seen a 45% improvement in student engagement and a 60% increase in course completion rates.`,
    techStack: ['Vue.js', 'Python', 'Django', 'TensorFlow', 'PostgreSQL'],
    features: [
      'AI-powered content recommendations',
      'Interactive video lessons with quizzes',
      'Real-time progress tracking',
      'Collaborative learning spaces',
      'Gamification elements',
      'Parent/teacher dashboards'
    ],
    liveUrl: 'https://demo.faxas.net/education',
    demoUrl: '/demos/education',
    images: [
      '/projects/education-1.jpg',
      '/projects/education-2.jpg',
      '/projects/education-3.jpg'
    ],
    metrics: {
      desktop: 97,
      mobile: 96,
      loadTime: 0.8,
      improvement: 210
    },
    testimonial: {
      content: 'The AI recommendations have been spot-on. Our students are more engaged than ever, and teachers love the insights they get.',
      client: 'Emily Rodriguez',
      role: 'Principal, Riverside Academy'
    },
    results: {
      engagementIncrease: '+145%',
      performanceGain: '210%',
      timeReduction: '55%',
      roi: '320%'
    },
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    id: '4',
    title: 'FinTech Mobile App',
    slug: 'fintech-app',
    category: 'Mobile App',
    description: 'Secure mobile banking app with investment tracking and budgeting tools',
    longDescription: `A comprehensive mobile banking solution that puts financial control in users' hands. Features include real-time transaction monitoring, investment portfolio tracking, automated budgeting, and peer-to-peer payments.
    
    The app has helped users save an average of 23% more money and has a 4.8-star rating with over 100,000 downloads.`,
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Plaid API', 'Stripe'],
    features: [
      'Biometric authentication',
      'Real-time transaction notifications',
      'Investment portfolio tracking',
      'Automated budget creation',
      'Bill payment reminders',
      'Cryptocurrency integration'
    ],
    liveUrl: 'https://demo.faxas.net/fintech',
    demoUrl: '/demos/fintech',
    images: [
      '/projects/fintech-1.jpg',
      '/projects/fintech-2.jpg'
    ],
    metrics: {
      desktop: 94,
      mobile: 98,
      loadTime: 0.7,
      improvement: 340
    },
    testimonial: {
      content: 'This app has completely changed how I manage my finances. The budgeting tools are incredible, and I love being able to track all my investments in one place.',
      client: 'James Wilson',
      role: 'App User & Investor'
    },
    results: {
      engagementIncrease: '+234%',
      performanceGain: '340%',
      timeReduction: '70%',
      roi: '520%'
    },
    gradient: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    id: '5',
    title: 'Real Estate Platform',
    slug: 'real-estate-platform',
    category: 'Real Estate',
    description: 'Property listing platform with virtual tours and AI-powered recommendations',
    longDescription: `A cutting-edge real estate platform that leverages AI and VR technology to revolutionize property searching and viewing. Users can take virtual tours, get AI-powered property recommendations, and complete transactions entirely online.
    
    Real estate agencies using our platform have seen a 180% increase in qualified leads and a 50% reduction in time-to-close.`,
    techStack: ['Next.js', 'Three.js', 'Python', 'FastAPI', 'PostgreSQL'],
    features: [
      '360-degree virtual property tours',
      'AI-powered property matching',
      'Integrated mortgage calculator',
      'Neighborhood insights and data',
      'Document management system',
      'Automated scheduling for viewings'
    ],
    liveUrl: 'https://demo.faxas.net/realestate',
    demoUrl: '/demos/realestate',
    images: [
      '/projects/realestate-1.jpg',
      '/projects/realestate-2.jpg',
      '/projects/realestate-3.jpg'
    ],
    metrics: {
      desktop: 95,
      mobile: 93,
      loadTime: 1.3,
      improvement: 180
    },
    testimonial: {
      content: 'The virtual tours have been a game-changer. Buyers can view properties from anywhere, and we close deals faster than ever.',
      client: 'Maria Garcia',
      role: 'Broker, Premier Realty Group'
    },
    results: {
      engagementIncrease: '+180%',
      performanceGain: '225%',
      timeReduction: '50%',
      roi: '385%'
    },
    gradient: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: '6',
    title: 'Social Media Dashboard',
    slug: 'social-dashboard',
    category: 'Social Media',
    description: 'Multi-platform social media management tool with AI-powered insights',
    longDescription: `An all-in-one social media management platform that helps businesses manage their presence across multiple platforms. Features AI-powered content recommendations, sentiment analysis, and automated scheduling.

    The platform has helped businesses increase their social media engagement by 320% and reduce management time by 75%.`,
    techStack: ['React', 'Node.js', 'GraphQL', 'Redis', 'OpenAI'],
    features: [
      'Multi-platform post scheduling',
      'AI-powered content recommendations',
      'Real-time sentiment analysis',
      'Competitor tracking and analysis',
      'Influencer identification tools',
      'Comprehensive analytics dashboard'
    ],
    liveUrl: 'https://demo.faxas.net/social',
    demoUrl: '/demos/social',
    images: [
      '/projects/social-1.jpg',
      '/projects/social-2.jpg'
    ],
    metrics: {
      desktop: 93,
      mobile: 90,
      loadTime: 1.1,
      improvement: 320
    },
    testimonial: {
      content: 'This dashboard has completely streamlined our social media operations. The AI insights are incredibly valuable.',
      client: 'Lisa Martinez',
      role: 'Social Media Director, BrandCo'
    },
    results: {
      engagementIncrease: '+320%',
      timeReduction: '75%',
      roi: '450%'
    },
    gradient: 'from-pink-500/20 to-purple-500/20'
  }
];

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = projectsData.find(p => p.slug === resolvedParams.slug);
  
  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}