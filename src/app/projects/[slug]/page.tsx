'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Globe, Play, Code, Zap, Shield, Users, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { EducationalTooltip, tooltips } from '@/components/educational/Tooltip';
import { sampleProjects } from '@/data/projects';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = sampleProjects.find(p => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

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
                
                <p className="text-xl text-text-secondary leading-relaxed">
                  {project.longDescription || project.description}
                </p>

                {/* Key Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Load Time</p>
                      <p className="font-semibold">{project.loadTime}</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Desktop Score</p>
                      <p className="font-semibold">{project.metrics.desktop}/100</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Mobile Score</p>
                      <p className="font-semibold">{project.metrics.mobile}/100</p>
                    </FloatingTile>
                    
                    <FloatingTile className="glass-primary p-4 text-center">
                      <Shield className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">Security</p>
                      <p className="font-semibold">A+ Grade</p>
                    </FloatingTile>
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {project.techStack.map((tech) => {
                    const techConcept = tech.toLowerCase().includes('react') ? tooltips.react :
                                       tech.toLowerCase().includes('api') ? tooltips.api :
                                       tech.toLowerCase().includes('next') ? tooltips.react :
                                       null;
                    
                    return techConcept ? (
                      <EducationalTooltip key={tech} {...techConcept}>
                        <span className="glass-secondary px-3 py-1.5 rounded-full text-sm font-medium cursor-help">
                          {tech}
                        </span>
                      </EducationalTooltip>
                    ) : (
                      <span key={tech} className="glass-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Demo Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="glass-primary p-2 rounded-2xl">
                  {project.demoUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link href={project.demoUrl}>
                          <motion.div
                            className="glass-accent p-6 rounded-full cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="w-12 h-12 text-white" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <p className="text-text-secondary">Demo Coming Soon</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        {project.features && project.features.length > 0 && (
          <motion.section 
            className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-glass-light/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Key Features
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Built with modern best practices and cutting-edge technologies
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FloatingTile className="glass-primary p-6 h-full">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                          <Code className="w-4 h-4 text-accent-blue" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">{feature}</h4>
                        </div>
                      </div>
                    </FloatingTile>
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
                <blockquote className="text-xl md:text-2xl font-medium text-text-primary mb-6">
                  "{project.testimonial.content}"
                </blockquote>
                <div>
                  <p className="font-semibold">{project.testimonial.client}</p>
                  <p className="text-text-secondary">{project.testimonial.role}</p>
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
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-8 text-center">
              More Projects
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {sampleProjects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((otherProject) => (
                  <Link key={otherProject.id} href={`/projects/${otherProject.slug}`}>
                    <FloatingTile className="glass-primary p-6 h-full hover:scale-[1.02] transition-transform cursor-pointer">
                      <h4 className="font-semibold text-lg mb-2">{otherProject.title}</h4>
                      <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                        {otherProject.description}
                      </p>
                      <div className="flex items-center gap-2 text-accent-blue">
                        <span className="text-sm font-medium">View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </FloatingTile>
                  </Link>
                ))}
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}