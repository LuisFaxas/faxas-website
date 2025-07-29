'use client';

import { motion } from 'framer-motion';
import { Question, QuestionOption } from '@/types/portal';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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
    if (question.required && value === undefined || value === null || value === '') {
      // Special handling for yes/no questions - false is a valid value
      if (question.type === 'yes-no' && value !== false && value !== true) {
        setError('This field is required');
        return;
      } else if (question.type !== 'yes-no' && !value) {
        setError('This field is required');
        return;
      }
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
            className={cn(
              "w-full px-4 py-3 bg-white/50 backdrop-blur-sm",
              "border-2 rounded-2xl transition-all duration-300",
              "focus:outline-none focus:ring-0",
              "border-glass-lighter hover:border-glass-light",
              "focus:border-accent-blue focus:bg-white/70 focus:shadow-lg",
              "text-text-primary placeholder:text-text-tertiary"
            )}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={cn(
              "w-full px-4 py-3 bg-white/50 backdrop-blur-sm",
              "border-2 rounded-2xl transition-all duration-300",
              "focus:outline-none focus:ring-0 resize-none",
              "border-glass-lighter hover:border-glass-light",
              "focus:border-accent-blue focus:bg-white/70 focus:shadow-lg",
              "text-text-primary placeholder:text-text-tertiary"
            )}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full px-4 py-3 bg-white/50 backdrop-blur-sm",
              "border-2 rounded-2xl transition-all duration-300",
              "focus:outline-none focus:ring-0",
              "border-glass-lighter hover:border-glass-light",
              "focus:border-accent-blue focus:bg-white/70 focus:shadow-lg",
              "text-text-primary"
            )}
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
                  'relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group',
                  value === option.value
                    ? 'border-accent-blue bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 shadow-lg'
                    : 'border-glass-lighter bg-white/30 hover:bg-white/50 hover:border-glass-light hover:shadow-md'
                )}
              >
                {value === option.value && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h4 className={cn(
                  "font-semibold mb-2 transition-colors",
                  value === option.value ? "text-accent-blue" : "text-text-primary"
                )}>{option.label}</h4>
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
                  'flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300',
                  selectedValues.includes(option.value)
                    ? 'bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-2 border-accent-blue shadow-md'
                    : 'bg-white/30 border-2 border-glass-lighter hover:bg-white/50 hover:border-glass-light'
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
            <motion.button
              type="button"
              onClick={() => onChange(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300",
                value === true
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg"
                  : "bg-white/30 border-2 border-glass-lighter hover:bg-white/50 text-text-primary"
              )}
            >
              Yes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => onChange(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300",
                value === false
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg"
                  : "bg-white/30 border-2 border-glass-lighter hover:bg-white/50 text-text-primary"
              )}
            >
              No
            </motion.button>
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
          <div className="relative w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
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
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-2xl bg-white/30 border-2 border-glass-lighter hover:bg-white/50 text-text-primary font-medium transition-all duration-300 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="ml-auto relative group"
          >
            <div className="relative h-12 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center gap-3">
                {isLast ? 'Complete' : 'Next'}
                {!isLast && <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
            </div>
          </button>
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