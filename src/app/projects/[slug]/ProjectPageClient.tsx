'use client';

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

interface ProjectPageClientProps {
  project: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    longDescription: string;
    techStack: string[];
    features: string[];
    liveUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    images?: string[];
    metrics?: {
      desktop: number;
      mobile: number;
      loadTime: number;
      improvement: number;
    };
    testimonial?: {
      content: string;
      client: string;
      role: string;
    };
    results?: {
      engagementIncrease?: string;
      performanceGain?: string;
      timeReduction?: string;
      roi?: string;
    };
    gradient: string;
  };
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
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
        <section className="relative py-20 overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            project.gradient
          )} />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                {project.category}
              </span>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {project.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.demoUrl && (
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  View Interactive Demo
                </Button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Project Screenshots */}
        {project.images && project.images.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    viewMode === 'desktop' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    viewMode === 'tablet' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Tablet className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    viewMode === 'mobile' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "relative mx-auto overflow-hidden rounded-xl shadow-2xl",
                    viewMode === 'desktop' && 'max-w-6xl',
                    viewMode === 'tablet' && 'max-w-2xl',
                    viewMode === 'mobile' && 'max-w-sm'
                  )}
                >
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm">{project.liveUrl || project.demoUrl}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 aspect-video flex items-center justify-center">
                    <div className="text-gray-400">
                      <Code2 className="w-24 h-24 mb-4 mx-auto" />
                      <p className="text-xl">Project Preview</p>
                    </div>
                  </div>
                </motion.div>

                {project.images.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={prevImage}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-2">
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            index === currentImageIndex ? 'bg-primary w-8' : 'bg-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={nextImage}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Project Details */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Overview */}
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Project Overview
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-primary" />
                  Key Features
                </h2>
                <ul className="space-y-4">
                  {project.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        {project.metrics && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Performance Metrics
              </h2>
              
              <div className="grid md:grid-cols-4 gap-8">
                <FloatingTile>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Monitor className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {project.metrics.desktop}
                    </div>
                    <p className="text-gray-600">Desktop Score</p>
                  </div>
                </FloatingTile>

                <FloatingTile>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Smartphone className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {project.metrics.mobile}
                    </div>
                    <p className="text-gray-600">Mobile Score</p>
                  </div>
                </FloatingTile>

                <FloatingTile>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Clock className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {project.metrics.loadTime}s
                    </div>
                    <p className="text-gray-600">Load Time</p>
                  </div>
                </FloatingTile>

                <FloatingTile>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <TrendingUp className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      +{project.metrics.improvement}%
                    </div>
                    <p className="text-gray-600">Improvement</p>
                  </div>
                </FloatingTile>
              </div>
            </div>
          </section>
        )}

        {/* Results & Impact */}
        {project.results && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Results & Impact
              </h2>
              
              <div className="grid md:grid-cols-4 gap-8">
                {project.results.engagementIncrease && (
                  <div className="text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {project.results.engagementIncrease}
                    </div>
                    <p className="text-gray-600">Engagement Increase</p>
                  </div>
                )}

                {project.results.performanceGain && (
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {project.results.performanceGain}
                    </div>
                    <p className="text-gray-600">Performance Gain</p>
                  </div>
                )}

                {project.results.timeReduction && (
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {project.results.timeReduction}
                    </div>
                    <p className="text-gray-600">Time Reduction</p>
                  </div>
                )}

                {project.results.roi && (
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {project.results.roi}
                    </div>
                    <p className="text-gray-600">ROI</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Client Testimonial */}
        {project.testimonial && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/20" />
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed relative z-10">
                  &ldquo;{project.testimonial.content}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900">{project.testimonial.client}</p>
                  <p className="text-gray-600">{project.testimonial.role}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how I can help transform your ideas into reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Start Your Project
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  View More Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}