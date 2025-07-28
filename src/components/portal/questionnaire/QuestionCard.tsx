'use client';

import { motion } from 'framer-motion';
import { Question, QuestionOption } from '@/types/portal';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    // Validate if required
    if (question.required && !value) {
      setError('This field is required');
      return;
    }

    // Custom validation
    if (question.validation) {
      if (question.validation.min && value < question.validation.min) {
        setError(question.validation.customMessage || `Minimum value is ${question.validation.min}`);
        return;
      }
      if (question.validation.max && value > question.validation.max) {
        setError(question.validation.customMessage || `Maximum value is ${question.validation.max}`);
        return;
      }
      if (question.validation.pattern) {
        const regex = new RegExp(question.validation.pattern);
        if (!regex.test(value)) {
          setError(question.validation.customMessage || 'Invalid format');
          return;
        }
      }
    }

    setError(null);
    onNext();
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-text-primary"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-text-primary resize-none"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-text-primary"
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'card-select':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {question.options?.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative p-6 rounded-2xl border-2 transition-all duration-200 text-left',
                  value === option.value
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-glass-lighter bg-white/30 hover:bg-white/40'
                )}
              >
                {value === option.value && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h4 className="font-semibold text-text-primary mb-2">{option.label}</h4>
                {option.description && (
                  <p className="text-sm text-text-secondary">{option.description}</p>
                )}
              </motion.button>
            ))}
          </div>
        );

      case 'multi-select':
        const selectedValues = value || [];
        return (
          <div className="grid md:grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200',
                  selectedValues.includes(option.value)
                    ? 'bg-accent-blue/20 border-2 border-accent-blue'
                    : 'bg-white/30 border-2 border-glass-lighter hover:bg-white/40'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selectedValues, option.value]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  selectedValues.includes(option.value)
                    ? 'bg-accent-blue border-accent-blue'
                    : 'bg-white/50 border-glass-lighter'
                )}>
                  {selectedValues.includes(option.value) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={question.validation?.min || 0}
              max={question.validation?.max || 100}
              value={value || question.validation?.min || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-text-secondary">
              <span>{question.validation?.min || 0}</span>
              <span className="text-lg font-semibold text-text-primary">{value || 0}</span>
              <span>{question.validation?.max || 100}</span>
            </div>
          </div>
        );

      case 'yes-no':
        return (
          <div className="flex gap-4">
            <Button
              type="button"
              variant={value === true ? 'primary' : 'secondary'}
              onClick={() => onChange(true)}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={value === false ? 'primary' : 'secondary'}
              onClick={() => onChange(false)}
              className="flex-1"
            >
              No
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <GlassPanel level="primary" className="p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round((questionNumber / totalQuestions) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">{question.title}</h2>
          {question.description && (
            <p className="text-text-secondary">{question.description}</p>
          )}
        </div>

        {/* Input */}
        <div className="mb-8">
          {renderInput()}
          {error && (
            <p className="mt-2 text-sm text-accent-red">{error}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {!isFirst && (
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            className="gap-2 ml-auto"
          >
            {isLast ? 'Complete' : 'Next'}
            {!isLast && <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      </GlassPanel>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  );
}