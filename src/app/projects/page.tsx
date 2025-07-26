'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Filter, Grid, List, Search, ArrowRight, Zap, Globe, Code } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { sampleProjects } from '@/data/projects';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = Array.from(new Set(sampleProjects.map(p => p.category)));

  // Filter projects based on category and search
  const filteredProjects = sampleProjects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
              These aren't just screenshots - they're fully functional applications.
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
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <FloatingTile 
                        className={cn(
                          "glass-primary p-6 h-full cursor-pointer group",
                          viewMode === 'list' && "flex gap-6"
                        )}
                      >
                        {/* Project Content */}
                        <div className={cn(
                          "space-y-4",
                          viewMode === 'list' && "flex-1"
                        )}>
                          {/* Header */}
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                                {project.title}
                              </h3>
                              {project.featured && (
                                <span className="glass-accent px-2 py-1 text-xs rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-text-secondary line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.slice(0, 3).map(tech => (
                              <span key={tech} className="glass-secondary px-2 py-1 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="text-xs text-text-secondary">
                                +{project.techStack.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Metrics */}
                          {project.metrics && (
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>{project.loadTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span>{project.metrics.desktop}/100</span>
                              </div>
                              {project.mobileOptimized && (
                                <div className="flex items-center gap-1">
                                  <Code className="w-4 h-4 text-green-500" />
                                  <span>Mobile Ready</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-accent-blue group-hover:gap-3 transition-all">
                            <span className="text-sm font-medium">View Project</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Preview for List View */}
                        {viewMode === 'list' && (
                          <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Code className="w-8 h-8 text-accent-blue/50" />
                          </div>
                        )}
                      </FloatingTile>
                    </Link>
                  </motion.div>
                ))}
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
                Let's create a web application that transforms your business
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