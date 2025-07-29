'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { ContactForm } from '@/components/forms/ContactForm';
import { EnhancedContactForm } from '@/components/forms/EnhancedContactForm';
import { ProjectInquiryForm } from '@/components/forms/ProjectInquiryForm';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formType, setFormType] = useState<'contact' | 'enhanced' | 'project'>('enhanced');

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
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              Let&apos;s Work Together
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Ready to transform your ideas into reality? Choose how you&apos;d like to connect.
            </p>
          </motion.div>

          {/* Form Type Toggle */}
          <motion.div 
            className="flex justify-center mb-12" 
            variants={itemVariants}
          >
            <GlassPanel level="light" className="p-1 flex gap-1">
              <Button
                variant={formType === 'enhanced' ? 'primary' : 'ghost'}
                onClick={() => setFormType('enhanced')}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Get Started
              </Button>
              <Button
                variant={formType === 'contact' ? 'primary' : 'ghost'}
                onClick={() => setFormType('contact')}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Quick Message
              </Button>
              <Button
                variant={formType === 'project' ? 'primary' : 'ghost'}
                onClick={() => setFormType('project')}
                className="gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Start a Project
              </Button>
            </GlassPanel>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="space-y-6">
                {/* Availability */}
                <GlassPanel level="secondary" className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Available Now</h3>
                      <p className="text-sm text-text-secondary">Taking on new projects</p>
                    </div>
                  </div>
                </GlassPanel>

                {/* Contact Methods */}
                <GlassPanel level="primary" className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-accent-blue" />
                      <a 
                        href="mailto:hello@faxas.net" 
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        hello@faxas.net
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-accent-blue" />
                      <a 
                        href="tel:+1234567890" 
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-accent-blue" />
                      <span className="text-text-secondary">
                        United States
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-accent-blue" />
                      <span className="text-text-secondary">
                        Mon-Fri, 9AM-6PM EST
                      </span>
                    </div>
                  </div>
                </GlassPanel>

                {/* Response Time */}
                <GlassPanel level="accent" className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Quick Response
                  </h3>
                  <p className="text-sm text-text-secondary">
                    I typically respond within 24 hours. For urgent matters, please call directly.
                  </p>
                </GlassPanel>

                {/* FAQ Link */}
                <GlassPanel level="secondary" className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Common Questions
                  </h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>• Project timelines: 2-12 weeks</li>
                    <li>• Payment terms: 50% upfront</li>
                    <li>• Tech stack: React, Next.js, Node.js</li>
                    <li>• Support: 90 days included</li>
                  </ul>
                </GlassPanel>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              {formType === 'enhanced' ? (
                <EnhancedContactForm 
                  source="contact_page"
                  onSuccess={() => {
                    // Could show a success modal or redirect
                    console.log('Enhanced contact form submitted successfully');
                  }} 
                />
              ) : formType === 'contact' ? (
                <ContactForm 
                  onSuccess={() => {
                    // Could show a success modal or redirect
                    console.log('Contact form submitted successfully');
                  }} 
                />
              ) : (
                <ProjectInquiryForm 
                  onSuccess={() => {
                    // Could show a success modal or redirect
                    console.log('Project inquiry submitted successfully');
                  }} 
                />
              )}
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-16 text-center" 
            variants={itemVariants}
          >
            <GlassPanel level="light" className="p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                Why Work With Me?
              </h3>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-accent-blue mb-1">5+</div>
                  <p className="text-sm text-text-secondary">Years Experience</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-green mb-1">50+</div>
                  <p className="text-sm text-text-secondary">Projects Completed</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-purple mb-1">98%</div>
                  <p className="text-sm text-text-secondary">Client Satisfaction</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-orange mb-1">24hr</div>
                  <p className="text-sm text-text-secondary">Response Time</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}