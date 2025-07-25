'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Globe, Play, Code, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/educational/SmartTooltip';
import { ComparisonWidget } from '@/components/educational/ComparisonWidget';
import { QuickPreview } from '@/components/showcase/QuickPreview';
import { sampleProjects } from '@/data/projects';
import { cn } from '@/lib/utils';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
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
                {project.technical.liveUrl && (
                  <Link href={project.technical.liveUrl} target="_blank">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.technical.githubUrl && (
                  <Link href={project.technical.githubUrl} target="_blank">
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
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <div className="inline-block">
                  <GlassPanel level="accent" className="px-4 py-2">
                    <span className="text-sm font-medium capitalize">
                      {project.category.replace('-', ' ')}
                    </span>
                  </GlassPanel>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
                  {project.title}
                </h1>
                
                <p className="text-xl text-text-secondary leading-relaxed">
                  {project.description}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <GlassPanel level="light" className="p-4">
                    <Zap className="w-5 h-5 text-accent-blue mb-2" />
                    <h4 className="font-medium text-sm">Performance</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {project.technical?.performance?.lighthouse?.performance || 95}+ Lighthouse Score
                    </p>
                  </GlassPanel>
                  
                  <GlassPanel level="light" className="p-4">
                    <Shield className="w-5 h-5 text-accent-green mb-2" />
                    <h4 className="font-medium text-sm">Security</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Enterprise-grade protection
                    </p>
                  </GlassPanel>
                  
                  <GlassPanel level="light" className="p-4">
                    <Users className="w-5 h-5 text-accent-purple mb-2" />
                    <h4 className="font-medium text-sm">User Experience</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Intuitive & accessible design
                    </p>
                  </GlassPanel>
                  
                  <GlassPanel level="light" className="p-4">
                    <TrendingUp className="w-5 h-5 text-accent-orange mb-2" />
                    <h4 className="font-medium text-sm">Business Impact</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Measurable results
                    </p>
                  </GlassPanel>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {project.technical.stack.map((tech) => (
                    <SmartTooltip
                      key={tech}
                      concept={tech}
                      trigger="hover"
                    >
                      <GlassPanel level="secondary" className="px-3 py-1.5">
                        <span className="text-sm font-medium">{tech}</span>
                      </GlassPanel>
                    </SmartTooltip>
                  ))}
                </div>
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div variants={itemVariants}>
                <GlassPanel level="primary" className="overflow-hidden">
                  <QuickPreview
                    type={project.showcase?.quickPreview?.type || 'widget'}
                    config={{
                      widget: {
                        size: 'large',
                        interaction: 'Interactive Demo',
                        realtime: true,
                        example: project.title
                      }
                    }}
                    projectTitle={project.title}
                    isActive={true}
                  />
                </GlassPanel>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Challenge & Solution */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <GlassPanel level="primary" className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-red/20 flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold">The Challenge</h3>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {"Modern businesses need web applications that not only look great but also perform exceptionally well across all devices and use cases."}
                </p>
              </GlassPanel>
              
              <GlassPanel level="primary" className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold">The Solution</h3>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {"A carefully crafted application using modern web technologies, focusing on performance, user experience, and maintainability."}
                </p>
              </GlassPanel>
            </div>
          </div>
        </motion.section>

        {/* Technical Features */}
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
                Technical Excellence
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Built with modern best practices and cutting-edge technologies
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {project.technical?.features?.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassPanel level="secondary" className="p-6 h-full">
                    <h4 className="font-semibold text-lg mb-2">{feature.name}</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      {feature.description}
                    </p>
                    {feature.educationalConceptId && (
                      <div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Code className="w-4 h-4" />
                          Learn More
                        </Button>
                      </div>
                    )}
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Educational Comparison */}
        {project.educational?.comparisons && project.educational.comparisons.length > 0 && (
          <motion.section 
            className="py-16 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Understanding the Technology
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  See how modern approaches create better experiences
                </p>
              </div>

              <ComparisonWidget
                title={project.educational.comparisons[0].title}
                traditional={{
                  demo: undefined,
                  issues: project.educational.comparisons[0].traditional.issues,
                  time: project.educational.comparisons[0].traditional.metric
                }}
                modern={{
                  demo: undefined,
                  benefits: project.educational.comparisons[0].modern.benefits,
                  time: project.educational.comparisons[0].modern.metric
                }}
                businessImpact={project.educational.comparisons[0].businessImpact}
              />
            </div>
          </motion.section>
        )}

        {/* Results & Impact */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <GlassPanel level="accent" className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Business Impact
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
                {"This project demonstrates how modern web development can create tangible business value through improved user experience and technical excellence."}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="primary" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  View Live Demo
                </Button>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Discuss Your Project
                  </Button>
                </Link>
              </div>
            </GlassPanel>
          </div>
        </motion.section>

        {/* Navigation to Other Projects */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-8 text-center">
              Explore More Projects
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {sampleProjects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((otherProject) => (
                  <Link key={otherProject.id} href={`/projects/${otherProject.slug}`}>
                    <GlassPanel level="primary" className="p-6 h-full hover:scale-[1.02] transition-transform">
                      <h4 className="font-semibold text-lg mb-2">{otherProject.title}</h4>
                      <p className="text-text-secondary text-sm line-clamp-2">
                        {otherProject.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-accent-blue">
                        <span className="text-sm font-medium">View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}