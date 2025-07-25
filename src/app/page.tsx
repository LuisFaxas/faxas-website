'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Palette } from 'lucide-react';

export default function Home() {
  return (
    <PageLayout>

        {/* Premium Hero Section */}
        <section className="relative min-h-screen flex items-center px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-center space-y-8"
            >
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <div className="glass-accent px-6 py-3 rounded-full inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-purple" />
                  <span className="text-sm font-medium bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                    Premium Web Development
                  </span>
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                </div>
              </motion.div>
              
              {/* Main Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight"
              >
                Building the Future,
                <br />
                <span className="gradient-text">One Line at a Time</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
              >
                Educational portfolio that transforms visitors into clients through progressive learning, 
                live demos, and premium glassmorphic experiences.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap gap-4 justify-center pt-4"
              >
                <Link href="/projects">
                  <Button variant="primary" size="lg" className="group">
                    <span>Explore Projects</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Start Your Project
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Floating Tiles */}
            <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <FloatingTile delay={600} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Quick Preview</h3>
                <p className="text-sm text-text-secondary">See code and demos side-by-side</p>
              </FloatingTile>
              
              <FloatingTile delay={700} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Demos</h3>
                <p className="text-sm text-text-secondary">Interact with real applications</p>
              </FloatingTile>
              
              <FloatingTile delay={800} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400/20 to-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Learn & Explore</h3>
                <p className="text-sm text-text-secondary">Understand the tech behind it</p>
              </FloatingTile>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative px-4 sm:px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">What I Build</h3>
              <p className="text-lg sm:text-xl text-text-secondary">Modern solutions for real business challenges</p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <FloatingTile delay={100} className="glass-primary p-6 sm:p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Web Applications</h4>
                <p className="text-text-secondary">
                  Full-stack applications with real-time features, beautiful UIs, and scalable architecture
                </p>
              </FloatingTile>
              
              <FloatingTile delay={200} className="glass-primary p-6 sm:p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">E-commerce Solutions</h4>
                <p className="text-text-secondary">
                  High-converting online stores with secure payments and inventory management
                </p>
              </FloatingTile>
              
              <FloatingTile delay={300} className="glass-primary p-6 sm:p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Progressive Web Apps</h4>
                <p className="text-text-secondary">
                  Mobile-first experiences that work offline and feel like native apps
                </p>
              </FloatingTile>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="relative px-6 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glass-blue to-transparent" />
          <div className="mx-auto max-w-7xl relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-4xl font-bold mb-4">How I Work</h3>
              <p className="text-xl text-text-secondary">A proven process that delivers results</p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Discover', desc: 'Understanding your goals and requirements', color: 'blue' },
                { step: 2, title: 'Design', desc: 'Creating beautiful, functional interfaces', color: 'purple' },
                { step: 3, title: 'Develop', desc: 'Building with clean, scalable code', color: 'pink' },
                { step: 4, title: 'Deploy', desc: 'Launching and ongoing support', color: 'green' }
              ].map((item, index) => (
                <FloatingTile key={item.step} delay={100 + index * 100} className="glass-secondary p-6 text-center">
                  <div className={`text-3xl font-bold mb-3 bg-gradient-to-r from-accent-${item.color} to-accent-purple bg-clip-text text-transparent`}>
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </FloatingTile>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Preview */}
        <section className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Featured Projects</h3>
              <p className="text-xl text-text-secondary">See what's possible with modern web development</p>
            </div>
            
            <div className="text-center">
              <Link href="/projects">
                <Button variant="primary" size="lg" float>
                  Explore All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-accent p-12 text-center rounded-[32px]"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Something Amazing?
              </h3>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                Let's transform your ideas into reality with modern web development that drives results.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="secondary" size="lg">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
    </PageLayout>
  );
}
