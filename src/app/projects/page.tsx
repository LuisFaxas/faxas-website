'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Grid, List, Search, ArrowRight, Zap, Globe, Code, Filter, Sparkles, TrendingUp, Award } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { OptimizedProjectCard } from '@/components/showcase/OptimizedProjectCard';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  techStack: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  status: string;
  metrics?: {
    desktop: number;
    mobile: number;
    loadTime: number;
    improvement?: number;
  };
  order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'completed'),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to sample data if Firebase fails
      const { sampleProjects } = await import('@/data/projects');
      setProjects(sampleProjects as any);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(projects.map(p => p.category)));

  // Filter projects based on category and search
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Separate featured and regular projects
  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <PageLayout>
      <div className="pb-24">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Live Project Showcase
            </motion.h1>
            <motion.p 
              className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Real projects. Real results. Click to experience them yourself.
              These aren&apos;t just screenshots - they&apos;re fully functional applications.
            </motion.p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-primary p-4 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search projects, technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      filter === 'all' 
                        ? "bg-accent-blue text-white" 
                        : "glass-secondary hover:bg-glass-light"
                    )}
                  >
                    All Projects
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-all capitalize",
                        filter === category 
                          ? "bg-accent-blue text-white" 
                          : "glass-secondary hover:bg-glass-light"
                      )}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'grid' 
                        ? "bg-accent-blue text-white" 
                        : "glass-secondary hover:bg-glass-light"
                    )}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'list' 
                        ? "bg-accent-blue text-white" 
                        : "glass-secondary hover:bg-glass-light"
                    )}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid/List */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No projects found matching your criteria.</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"
              )}>
                {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-secondary">Loading amazing projects...</p>
                </div>
              ) : (
                <>
                  {/* Featured Projects */}
                  {featuredProjects.length > 0 && (
                    <div className="col-span-full mb-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        Featured Projects
                      </h2>
                      <div className={cn(
                        viewMode === 'grid' 
                          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                          : "space-y-6"
                      )}>
                        {featuredProjects.map((project, index) => (
                          <OptimizedProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Projects */}
                  {regularProjects.map((project, index) => (
                    <OptimizedProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index + featuredProjects.length} 
                    />
                  ))}
                </>
              )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          className="px-4 sm:px-6 lg:px-8 pt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="glass-accent p-8 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Let&apos;s create a web application that transforms your business
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}