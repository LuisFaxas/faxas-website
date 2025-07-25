'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { ProgressTracker } from '@/components/educational/ProgressTracker';
import { sampleProjects } from '@/data/projects';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'web-app' | 'interactive' | 'technical'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [userConcepts, setUserConcepts] = useState<any[]>([]);

  // Filter projects based on category and search
  const filteredProjects = sampleProjects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate total concepts from all projects
  const totalConcepts = sampleProjects.reduce((total, project) => 
    total + (project.educational?.concepts?.length || 0), 0
  );

  return (
    <PageLayout>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-text-primary mb-4"
            >
              Featured Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
            >
              Explore real-world solutions built with cutting-edge technology. 
              Each project showcases modern development practices and measurable business impact.
            </motion.p>

            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <ProgressTracker
                concepts={userConcepts}
                totalConcepts={totalConcepts}
              />
            </motion.div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <GlassPanel level="light" className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-1 rounded-full bg-glass-light/50">
                    {(['all', 'web-app', 'interactive', 'technical'] as const).map((category) => (
                      <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          filter === category
                            ? "bg-white shadow-sm text-text-primary"
                            : "text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {category === 'all' ? 'All' : category.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </button>
                    ))}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-glass-light/50">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 rounded transition-all",
                        viewMode === 'grid'
                          ? "bg-white shadow-sm text-text-primary"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 rounded transition-all",
                        viewMode === 'list'
                          ? "bg-white shadow-sm text-text-primary"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-text-secondary">
                Showing {filteredProjects.length} of {sampleProjects.length} projects
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className={cn(
              "grid gap-8",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}>
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Filter className="w-12 h-12 text-text-secondary/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  No projects found
                </h3>
                <p className="text-text-secondary">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            )}
          </div>
        </section>
    </PageLayout>
  );
}
