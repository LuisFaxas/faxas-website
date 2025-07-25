'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/lib/firebase/leads';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function ContactForm({ className, onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await submitContactForm(data);
      
      if (result.success) {
        setSubmitStatus('success');
        reset();
        toast.success('Message sent!', "I'll get back to you within 24 hours.");
        onSuccess?.();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
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

  return (
    <GlassPanel level="primary" className={cn('p-8', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Let's Build Something Amazing
          </h2>
          <p className="text-text-secondary">
            Tell me about your project and I'll get back to you within 24 hours.
          </p>
        </div>

        <div className="space-y-4">
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

          {/* Company Field (Optional) */}
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

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
              Your Message *
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={5}
              className={cn(
                'w-full px-4 py-3 rounded-2xl',
                'bg-white/50 backdrop-blur-sm',
                'border border-glass-lighter',
                'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
                'transition-all duration-200',
                'resize-none',
                errors.message && 'border-accent-red focus:ring-accent-red/50'
              )}
              placeholder="Tell me about your project, goals, and timeline..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-accent-red">{errors.message.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full relative"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </Button>

          {/* Status Messages */}
          <AnimatePresence mode="wait">
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-accent-green"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Message sent successfully! I'll get back to you soon.
                </span>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-accent-red"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-text-secondary text-center">
          By submitting this form, you agree to receive communications about your project.
          Your information is kept confidential and never shared.
        </p>
      </form>
    </GlassPanel>
  );
}