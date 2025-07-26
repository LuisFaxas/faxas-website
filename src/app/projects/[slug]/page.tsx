'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Globe, 
  Play, 
  Code, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Code2
} from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { cn } from '@/lib/utils';

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
      'Multi-warehouse inventory management',
      'Customer behavior tracking and insights',
      'Mobile-responsive design for on-the-go management'
    ],
    liveUrl: 'https://demo.faxas.net/ecommerce',
    githubUrl: 'https://github.com/luisfaxas/ecommerce-dashboard',
    demoUrl: '/demos/ecommerce',
    images: [
      '/projects/ecommerce-1.jpg',
      '/projects/ecommerce-2.jpg',
      '/projects/ecommerce-3.jpg'
    ],
    featured: true,
    metrics: {
      desktop: 98,
      mobile: 95,
      loadTime: 0.8,
      improvement: 276
    },
    testimonial: {
      content: 'This dashboard transformed how we manage our inventory. The real-time updates and analytics have been game-changing for our business.',
      client: 'Sarah Chen',
      role: 'CEO, TechStyle Boutique',
      avatar: '/testimonials/sarah.jpg'
    },
    results: {
      revenueIncrease: '+276%',
      timeReduction: '80%',
      customerSatisfaction: '98%'
    },
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: '2',
    title: 'SaaS Analytics Platform',
    slug: 'saas-analytics',
    category: 'Data Visualization',
    description: 'Powerful analytics platform with custom dashboards and real-time data processing',
    longDescription: `An enterprise-grade analytics platform designed for SaaS companies to track, analyze, and optimize their key metrics. Features include custom dashboard creation, real-time data visualization, predictive analytics, and automated reporting.

    This platform processes millions of data points daily and provides actionable insights that have helped our clients increase their conversion rates by an average of 198%.`,
    techStack: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'AWS'],
    features: [
      'Custom dashboard builder with drag-and-drop interface',
      'Real-time data streaming and visualization',
      'Predictive analytics with machine learning',
      'Automated report generation and scheduling',
      'API integration hub for third-party services',
      'White-label customization options'
    ],
    liveUrl: 'https://demo.faxas.net/analytics',
    demoUrl: '/demos/analytics',
    images: [
      '/projects/analytics-1.jpg',
      '/projects/analytics-2.jpg'
    ],
    featured: true,
    metrics: {
      desktop: 96,
      mobile: 92,
      loadTime: 1.2,
      improvement: 198
    },
    testimonial: {
      content: 'The insights we get from this platform have revolutionized our decision-making process. It\'s like having a data scientist on the team.',
      client: 'David Park',
      role: 'CTO, Tech Solutions Inc',
      avatar: '/testimonials/david.jpg'
    },
    results: {
      dataProcessing: '10M+ daily',
      conversionIncrease: '+198%',
      timeToInsight: '90% faster'
    },
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: '3',
    title: 'Healthcare Portal',
    slug: 'healthcare-portal',
    category: 'Healthcare',
    description: 'HIPAA-compliant patient management system with telemedicine capabilities',
    longDescription: `A secure, HIPAA-compliant healthcare portal that connects patients with providers through a modern, intuitive interface. Features include appointment scheduling, telemedicine consultations, electronic health records, and secure messaging.

    The platform has improved patient engagement by 150% and reduced administrative overhead by 60% for our healthcare clients.`,
    techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'WebRTC'],
    features: [
      'HIPAA-compliant security and encryption',
      'Video consultations with WebRTC',
      'Electronic health records management',
      'Appointment scheduling and reminders',
      'Secure patient-provider messaging',
      'Prescription management system'
    ],
    liveUrl: 'https://demo.faxas.net/healthcare',
    githubUrl: 'https://github.com/luisfaxas/healthcare-portal',
    demoUrl: '/demos/healthcare',
    images: [
      '/projects/healthcare-1.jpg',
      '/projects/healthcare-2.jpg'
    ],
    metrics: {
      desktop: 94,
      mobile: 91,
      loadTime: 0.9,
      improvement: 150
    },
    testimonial: {
      content: 'This portal has revolutionized how we interact with patients. The telemedicine features saved us during the pandemic.',
      client: 'Dr. Emily Rodriguez',
      role: 'Medical Director, HealthFirst Clinic'
    },
    results: {
      patientEngagement: '+150%',
      adminReduction: '60%',
      appointmentNoShows: '-45%'
    },
    gradient: 'from-green-500/20 to-blue-500/20'
  },
  {
    id: '4',
    title: 'Financial Trading App',
    slug: 'trading-app',
    category: 'FinTech',
    description: 'Real-time trading platform with advanced charting and portfolio management',
    longDescription: `A sophisticated trading platform that provides real-time market data, advanced charting tools, and automated trading strategies. Built with institutional-grade security and millisecond-level performance.

    The platform handles over 100,000 transactions daily with 99.99% uptime and has helped traders improve their portfolio performance by an average of 35%.`,
    techStack: ['React', 'WebSocket', 'Chart.js', 'Python', 'Redis'],
    features: [
      'Real-time market data streaming',
      'Advanced charting with 50+ indicators',
      'Automated trading strategies',
      'Portfolio analytics and reporting',
      'Risk management tools',
      'Mobile trading app'
    ],
    liveUrl: 'https://demo.faxas.net/trading',
    demoUrl: '/demos/trading',
    images: [
      '/projects/trading-1.jpg',
      '/projects/trading-2.jpg'
    ],
    metrics: {
      desktop: 97,
      mobile: 93,
      loadTime: 0.7,
      improvement: 35
    },
    testimonial: {
      content: 'The speed and reliability of this platform have given us a real edge in the market. It\'s simply the best trading interface we\'ve used.',
      client: 'Michael Thompson',
      role: 'Head Trader, Alpha Investments'
    },
    results: {
      transactionsDaily: '100K+',
      uptime: '99.99%',
      performanceGain: '+35%'
    },
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: '5',
    title: 'Educational Platform',
    slug: 'edu-platform',
    category: 'EdTech',
    description: 'Interactive learning management system with video streaming and assessments',
    longDescription: `A comprehensive educational platform that transforms traditional learning into an engaging, interactive experience. Features AI-powered personalized learning paths, real-time collaboration tools, and detailed progress analytics.

    The platform has helped educational institutions increase student engagement by 200% and improve course completion rates by 65%.`,
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'AWS S3'],
    features: [
      'HD video streaming with adaptive bitrate',
      'Interactive quizzes and assessments',
      'AI-powered learning recommendations',
      'Real-time collaboration tools',
      'Progress tracking and analytics',
      'Mobile-first responsive design'
    ],
    liveUrl: 'https://demo.faxas.net/education',
    githubUrl: 'https://github.com/luisfaxas/edu-platform',
    demoUrl: '/demos/education',
    images: [
      '/projects/education-1.jpg',
      '/projects/education-2.jpg'
    ],
    metrics: {
      desktop: 95,
      mobile: 94,
      loadTime: 1.0,
      improvement: 200
    },
    testimonial: {
      content: 'This platform has transformed how we deliver education. Student engagement is through the roof!',
      client: 'Prof. James Wilson',
      role: 'Dean of Online Learning, TechU'
    },
    results: {
      studentEngagement: '+200%',
      completionRate: '+65%',
      satisfactionScore: '4.8/5'
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
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projectsData.find(p => p.slug === params.slug);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  if (!project) {
    notFound();
  }

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  return (
    <PageLayout>
      <div className="pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Github className="w-4 h-4" />
                      Source Code
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section 
          className="pt-16 pb-12 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="glass-accent px-4 py-2 rounded-full">
                    <span className="text-sm font-medium capitalize">
                      {project.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
                  {project.title}
                </h1>
                
                <div className="text-xl text-text-secondary leading-relaxed">
                  {project.longDescription?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Key Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Clock className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Load Time</p>
                      <p className="font-semibold">{project.metrics.loadTime}s</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Monitor className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Desktop Score</p>
                      <p className="font-semibold">{project.metrics.desktop}/100</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Smartphone className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Mobile Score</p>
                      <p className="font-semibold">{project.metrics.mobile}/100</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Improvement</p>
                      <p className="font-semibold">+{project.metrics.improvement}%</p>
                    </FloatingTile>
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="glass-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column - Metrics Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <FloatingTile className="glass-primary p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    Project Impact
                  </h3>
                  
                  {project.results && (
                    <div className="space-y-6">
                      {Object.entries(project.results).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-3xl font-bold gradient-text mb-1">{value}</p>
                          <p className="text-sm text-text-secondary capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-glass-lighter">
                    <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Verified Results</span>
                    </div>
                  </div>
                </FloatingTile>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Project Gallery */}
        {project.images && project.images.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-primary p-8 rounded-3xl"
              >
                {/* Device Switcher */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Project Screenshots</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewMode === 'desktop' ? "glass-accent" : "glass-secondary hover:bg-glass-light"
                      )}
                    >
                      <Monitor className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewMode === 'tablet' ? "glass-accent" : "glass-secondary hover:bg-glass-light"
                      )}
                    >
                      <Tablet className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewMode === 'mobile' ? "glass-accent" : "glass-secondary hover:bg-glass-light"
                      )}
                    >
                      <Smartphone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Image Carousel */}
                <div className={cn(
                  "relative bg-gradient-to-br rounded-xl overflow-hidden",
                  project.gradient || 'from-gray-100 to-gray-200',
                  viewMode === 'desktop' && "aspect-video",
                  viewMode === 'tablet' && "aspect-[4/3] max-w-2xl mx-auto",
                  viewMode === 'mobile' && "aspect-[9/16] max-w-sm mx-auto"
                )}>
                  {project.images.map((image, index) => (
                    <motion.div
                      key={image}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="relative w-full h-full flex items-center justify-center p-8">
                        {/* Placeholder for image */}
                        <div className="text-center">
                          <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500">Project Screenshot {index + 1}</p>
                          <p className="text-xs text-gray-400 mt-2">{viewMode} view</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Navigation */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass-accent rounded-lg hover:scale-110 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass-accent rounded-lg hover:scale-110 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Image Indicators */}
                {project.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          currentImageIndex === index 
                            ? "w-8 bg-accent-blue" 
                            : "bg-glass-lighter hover:bg-glass-light"
                        )}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {project.features && project.features.length > 0 && (
          <motion.section 
            className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-glass-blue/10 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-accent-blue" />
                  Key Features
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Built with modern best practices and cutting-edge technologies
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <p className="text-lg text-text-secondary">{feature}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Testimonial Section */}
        {project.testimonial && (
          <motion.section 
            className="py-16 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="glass-accent p-8 md:p-12 rounded-3xl text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mx-auto mb-6" />
                <Quote className="w-12 h-12 text-accent-purple mx-auto mb-6" />
                <blockquote className="text-xl md:text-2xl font-medium text-text-primary mb-6 italic">
                  "{project.testimonial.content}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold">{project.testimonial.client}</p>
                    <p className="text-text-secondary">{project.testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="glass-primary p-8 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Want Something Similar?
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
                Let's discuss how modern web technology can transform your business
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {project.demoUrl && (
                  <Link href={project.demoUrl}>
                    <Button variant="primary" size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Try Live Demo
                    </Button>
                  </Link>
                )}
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Start Your Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Related Projects */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-glass-purple/10 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-text-primary mb-12 text-center">
              Explore More Projects
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {projectsData
                .filter(p => p.id !== project.id && p.category !== project.category)
                .slice(0, 3)
                .map((otherProject, index) => (
                  <motion.div
                    key={otherProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/projects/${otherProject.slug}`}>
                      <FloatingTile className="glass-primary p-6 h-full hover:scale-[1.02] transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <span className="glass-accent px-3 py-1 rounded-full text-xs">
                            {otherProject.category}
                          </span>
                          {otherProject.featured && (
                            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          )}
                        </div>
                        <h4 className="font-semibold text-lg mb-2 group-hover:text-accent-blue transition-colors">
                          {otherProject.title}
                        </h4>
                        <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                          {otherProject.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {otherProject.techStack.slice(0, 2).map((tech) => (
                              <span key={tech} className="text-xs glass-lighter px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-accent-blue text-sm">
                            <span>View</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </FloatingTile>
                    </Link>
                  </motion.div>
                ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  View All Projects
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}