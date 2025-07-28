'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Building,
  Phone,
  DollarSign,
  Calendar,
  Briefcase,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/lib/firebase/leads';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { ContactFormData } from '@/types/firebase';

// Schema for progressive validation
const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const projectDetailsSchema = z.object({
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const fullSchema = basicInfoSchema.merge(projectDetailsSchema);

type FormData = z.infer<typeof fullSchema>;

interface EnhancedContactFormProps {
  className?: string;
  onSuccess?: () => void;
  source?: string;
}

const budgetOptions = [
  { value: 'under-5k', label: 'Under $5k' },
  { value: '5k-10k', label: '$5k - $10k' },
  { value: '10k-25k', label: '$10k - $25k' },
  { value: '25k-50k', label: '$25k - $50k' },
  { value: '50k+', label: '$50k+' },
];

const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-months+', label: '6+ months' },
];

const projectTypeOptions = [
  { value: 'new-website', label: 'New Website' },
  { value: 'redesign', label: 'Website Redesign' },
  { value: 'web-app', label: 'Web Application' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'other', label: 'Other' },
];

export function EnhancedContactForm({ className, onSuccess, source = 'contact_form' }: EnhancedContactFormProps) {
  const [step, setStep] = useState<'basic' | 'details'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const handleNextStep = async () => {
    // Validate basic fields before proceeding
    const isValid = await trigger(['name', 'email', 'message']);
    if (isValid) {
      setStep('details');
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const contactData: ContactFormData = {
        ...data,
        source
      };
      
      const result = await submitContactForm(contactData);
      
      if (result.success) {
        setSubmitStatus('success');
        reset();
        toast.success('Message sent!', "I'll get back to you within 24 hours.");
        onSuccess?.();
        
        // Reset form after delay
        setTimeout(() => {
          setSubmitStatus('idle');
          setStep('basic');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send message. Please try again.');
        toast.error('Failed to send message', result.error);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    const basicFields = ['name', 'email', 'message'];
    const detailFields = ['company', 'phone', 'projectType', 'budget', 'timeline'];
    const allFields = [...basicFields, ...detailFields];
    
    const filledFields = allFields.filter(field => watchedFields[field as keyof FormData]);
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  if (submitStatus === 'success') {
    return (
      <GlassPanel level="primary" className={cn('p-8', className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Thank you for reaching out!
          </h3>
          <p className="text-text-secondary mb-6">
            I'll review your message and get back to you within 24 hours.
          </p>
          <Button
            onClick={() => {
              setSubmitStatus('idle');
              setStep('basic');
            }}
            variant="secondary"
          >
            Send Another Message
          </Button>
        </motion.div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel level="primary" className={cn('p-8', className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-text-primary">
              {step === 'basic' ? "Let's Connect" : 'Project Details'}
            </h2>
            <span className="text-sm text-text-secondary">
              {calculateProgress()}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-accent-blue to-accent-purple rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'basic' ? (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <p className="text-text-secondary mb-4">
                Tell me about yourself and your project idea.
              </p>

              {/* Name Field */}
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

              {/* Email Field */}
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

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Tell me about your project *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200',
                    'resize-none',
                    errors.message && 'border-accent-red focus:ring-accent-red/50'
                  )}
                  placeholder="Describe your project goals, challenges, and what success looks like..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-accent-red">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  variant="primary"
                  className="flex-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <span>Quick Submit</span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-text-secondary">
                  Optional: Share more details to help me understand your needs better.
                </p>
                <button
                  type="button"
                  onClick={() => setStep('basic')}
                  className="text-sm text-accent-blue hover:text-accent-blue/80"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Company Name
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
                  placeholder="Acme Inc."
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
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
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-text-primary mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Project Type
                </label>
                <select
                  {...register('projectType')}
                  id="projectType"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Select project type</option>
                  {projectTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-text-primary mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Budget Range
                </label>
                <select
                  {...register('budget')}
                  id="budget"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Select budget range</option>
                  {budgetOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-text-primary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Timeline
                </label>
                <select
                  {...register('timeline')}
                  id="timeline"
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl',
                    'bg-white/50 backdrop-blur-sm',
                    'border border-glass-lighter',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Select timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Complete Message</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-accent-red mt-4"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-text-secondary text-center mt-6">
          By submitting this form, you agree to receive communications about your project.
          Your information is kept confidential and never shared.
        </p>
      </form>
    </GlassPanel>
  );
}