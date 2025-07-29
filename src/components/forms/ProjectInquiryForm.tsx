'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/lib/firebase/leads';
import { cn } from '@/lib/utils';

const projectInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  message: z.string().min(20, 'Please provide more details about your project'),
});

type ProjectInquiryData = z.infer<typeof projectInquirySchema>;

interface ProjectInquiryFormProps {
  className?: string;
  onSuccess?: () => void;
}

const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'ecommerce', label: 'E-commerce Site' },
  { value: 'corporate', label: 'Corporate Website' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'other', label: 'Other' },
];

const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-20k', label: '$10,000 - $20,000' },
  { value: '20k-50k', label: '$20,000 - $50,000' },
  { value: 'over-50k', label: 'Over $50,000' },
];

const TIMELINES = [
  { value: 'asap', label: 'ASAP / Immediate' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'flexible', label: 'Flexible' },
];

export function ProjectInquiryForm({ className, onSuccess }: ProjectInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProjectInquiryData>({
    resolver: zodResolver(projectInquirySchema)
  });

  const watchedFields = watch();

  const onSubmit = async (data: ProjectInquiryData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await submitContactForm({
        ...data,
        source: 'project-inquiry-form',
        referrer: window.location.href,
      });
      
      if (result.success) {
        setSubmitStatus('success');
        reset();
        onSuccess?.();
        
        // Reset to step 1 after success
        setTimeout(() => {
          setCurrentStep(1);
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Project inquiry error:', error);
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <GlassPanel level="primary" className={cn('p-8', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Start Your Project
          </h2>
          <p className="text-text-secondary">
            Get a detailed proposal and timeline for your project.
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all',
                  step <= currentStep ? 'bg-accent-blue' : 'bg-glass-lighter'
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                Contact Information
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  Your Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    errors.name && 'border-accent-red focus:ring-accent-red/50'
                  )}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-accent-red">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    errors.email && 'border-accent-red focus:ring-accent-red/50'
                  )}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-accent-red">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                  Company
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200'
                  )}
                  placeholder="Acme Inc. (optional)"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200'
                  )}
                  placeholder="+1 (555) 123-4567 (optional)"
                />
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                className="w-full"
                disabled={!watchedFields.name || !watchedFields.email}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                Project Details
              </h3>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-text-primary mb-2">
                  Project Type *
                </label>
                <select
                  {...register('projectType')}
                  id="projectType"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    errors.projectType && 'border-accent-red focus:ring-accent-red/50'
                  )}
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-sm text-accent-red">{errors.projectType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-text-primary mb-2">
                  Budget Range *
                </label>
                <select
                  {...register('budget')}
                  id="budget"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    errors.budget && 'border-accent-red focus:ring-accent-red/50'
                  )}
                >
                  <option value="">Select budget range</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="mt-1 text-sm text-accent-red">{errors.budget.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-text-primary mb-2">
                  Timeline *
                </label>
                <select
                  {...register('timeline')}
                  id="timeline"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    errors.timeline && 'border-accent-red focus:ring-accent-red/50'
                  )}
                >
                  <option value="">Select timeline</option>
                  {TIMELINES.map((timeline) => (
                    <option key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="mt-1 text-sm text-accent-red">{errors.timeline.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="flex-1"
                  disabled={!watchedFields.projectType || !watchedFields.budget || !watchedFields.timeline}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Project Description */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                Tell Us More
              </h3>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Project Description *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={6}
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    'resize-none',
                    errors.message && 'border-accent-red focus:ring-accent-red/50'
                  )}
                  placeholder="Please describe your project goals, target audience, key features you need, and any specific requirements or challenges..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-accent-red">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-accent-green/10 border border-accent-green/30 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-accent-green mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Inquiry sent successfully!</span>
              </div>
              <p className="text-sm text-text-secondary">
                Thank you for your interest! I'll review your project details and get back to you within 24 hours with a detailed proposal.
              </p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-accent-red/10 border border-accent-red/30 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-accent-red mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Something went wrong</span>
              </div>
              <p className="text-sm text-text-secondary">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </GlassPanel>
  );
}