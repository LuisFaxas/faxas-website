'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassmorphicProjectCard } from '@/components/showcase/GlassmorphicProjectCard';
import { cn } from '@/lib/utils';

// Static project data - no Firebase, no images needed
const staticProjects = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    category: 'Web Application',
    description: 'Real-time inventory management system with advanced analytics and reporting',
    techStack: ['React', 'Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    liveUrl: 'https://demo.faxas.net/ecommerce',
    githubUrl: 'https://github.com/luisfaxas/ecommerce-dashboard',
    featured: true,
    metrics: {
      desktop: 98,
      mobile: 95,
      loadTime: 0.8,
      improvement: 276
    },
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: '2',
    title: 'SaaS Analytics Platform',
    slug: 'saas-analytics',
    category: 'Data Visualization',
    description: 'Powerful analytics platform with custom dashboards and real-time data processing',
    techStack: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://demo.faxas.net/analytics',
    featured: true,
    metrics: {
      desktop: 96,
      mobile: 92,
      loadTime: 1.2,
      improvement: 198
    },
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: '3',
    title: 'Healthcare Portal',
    slug: 'healthcare-portal',
    category: 'Healthcare',
    description: 'HIPAA-compliant patient management system with telemedicine capabilities',
    techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'WebRTC'],
    liveUrl: 'https://demo.faxas.net/healthcare',
    githubUrl: 'https://github.com/luisfaxas/healthcare-portal',
    metrics: {
      desktop: 94,
      mobile: 91,
      loadTime: 0.9
    },
    gradient: 'from-green-500/20 to-blue-500/20'
  },
  {
    id: '4',
    title: 'Financial Trading App',
    slug: 'trading-app',
    category: 'FinTech',
    description: 'Real-time trading platform with advanced charting and portfolio management',
    techStack: ['React', 'WebSocket', 'Chart.js', 'Python', 'Redis'],
    liveUrl: 'https://demo.faxas.net/trading',
    metrics: {
      desktop: 97,
      mobile: 93,
      loadTime: 0.7
    },
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: '5',
    title: 'Educational Platform',
    slug: 'edu-platform',
    category: 'EdTech',
    description: 'Interactive learning management system with video streaming and assessments',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'AWS S3'],
    liveUrl: 'https://demo.faxas.net/education',
    githubUrl: 'https://github.com/luisfaxas/edu-platform',
    metrics: {
      desktop: 95,
      mobile: 94,
      loadTime: 1.0
    },
    gradient: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: '6',
    title: 'Social Media Dashboard',
    slug: 'social-dashboard',
    category: 'Social Media',
    description: 'Multi-platform social media management tool with AI-powered insights',
    techStack: ['React', 'Node.js', 'GraphQL', 'Redis', 'OpenAI'],
    liveUrl: 'https://demo.faxas.net/social',
    metrics: {
      desktop: 93,
      mobile: 90,
      loadTime: 1.1
    },
    gradient: 'from-pink-500/20 to-purple-500/20'
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique categories
  const categories = Array.from(new Set(staticProjects.map(p => p.category)));
  
  // Filter projects based on search and category
  const filteredProjects = staticProjects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech: string) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || project.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-purple-500/5 to-accent-purple/10" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-accent px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Projects</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
            My Portfolio
          </h1>
          
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Explore high-performance web applications built with modern technologies. 
            Each project showcases best practices in React, performance optimization, and user experience.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search projects, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "glass-accent px-4 py-2 rounded-lg transition-all",
                filter === 'all' && "bg-accent-blue/20 ring-2 ring-accent-blue/50"
              )}
            >
              All Projects
            </button>
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  "glass-accent px-4 py-2 rounded-lg transition-all",
                  filter === category && "bg-accent-blue/20 ring-2 ring-accent-blue/50"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass-primary inline-block p-8 rounded-2xl">
                <Search className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
                <p className="text-lg text-text-secondary">No projects found matching your criteria.</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <GlassmorphicProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-primary p-12 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Let&apos;s Build Something Amazing Together</h2>
            <p className="text-lg text-text-secondary mb-8">
              Have a project in mind? I&apos;d love to help bring your vision to life with modern, performant web technologies.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 glass-accent px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
            >
              Start a Project
              <Sparkles className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  );
}
