'use client';

import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-panel';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  MessageSquare,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { Lead } from '@/lib/firebase/leads';
import { PortalUser, QuestionnaireSession, getTemperatureEmoji } from '@/types/portal';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface EnhancedLead extends Lead {
  portalUser?: PortalUser;
  questionnaire?: QuestionnaireSession;
}

interface LeadCardProps {
  lead: EnhancedLead;
  onClick: () => void;
  isSelected?: boolean;
}

export function LeadCard({ lead, onClick, isSelected }: LeadCardProps) {
  // Get temperature and emoji from questionnaire score
  const score = lead.questionnaire?.score || lead.score;
  const temperature = getTemperature(score);
  const temperatureEmoji = getTemperatureEmoji(temperature);
  
  // Temperature-based styling
  const temperatureStyles = {
    hot: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50',
    warm: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    qualified: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50',
    cool: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
    early: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50',
  };

  const temperatureColors = {
    hot: 'text-red-600',
    warm: 'text-yellow-600',
    qualified: 'text-blue-600',
    cool: 'text-cyan-600',
    early: 'text-green-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassPanel 
        level="primary" 
        className={cn(
          "p-4 sm:p-6 cursor-pointer transition-all",
          "hover:shadow-lg hover:border-accent-blue/50",
          isSelected && "ring-2 ring-accent-blue shadow-lg",
          temperature && temperatureStyles[temperature]
        )}
        onClick={onClick}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left side - Lead info */}
          <div className="flex-1 space-y-3">
            {/* Header with name and score */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold">
                  {lead.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary flex items-center gap-2">
                    {lead.name || 'Unknown'}
                    {score >= 80 && (
                      <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
                        HOT LEAD
                      </span>
                    )}
                  </h3>
                  {lead.company && (
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {lead.company}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Score badge */}
              <div className={cn(
                "text-center px-3 py-2 rounded-xl",
                "bg-white/50 backdrop-blur-sm border",
                temperature && temperatureStyles[temperature]
              )}>
                <div className="text-2xl font-bold">
                  {temperatureEmoji}
                </div>
                <div className={cn(
                  "text-sm font-semibold",
                  temperature && temperatureColors[temperature]
                )}>
                  {score}
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="w-4 h-4" />
                <a 
                  href={`mailto:${lead.email}`} 
                  className="hover:text-accent-blue transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <a 
                    href={`tel:${lead.phone}`} 
                    className="hover:text-accent-blue transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Message preview or questionnaire status */}
            {lead.questionnaire ? (
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-accent-blue" />
                <span className="text-text-secondary">
                  Questionnaire completed • {lead.questionnaire.responses?.length || 0} responses
                </span>
              </div>
            ) : lead.message && (
              <p className="text-sm text-text-secondary line-clamp-2">
                {lead.message}
              </p>
            )}

            {/* Bottom info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(lead.createdAt?.toDate() || new Date(), { addSuffix: true })}
              </div>
              {lead.source && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {lead.source}
                </div>
              )}
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                lead.status === 'new' && "bg-green-100 text-green-700",
                lead.status === 'contacted' && "bg-blue-100 text-blue-700",
                lead.status === 'qualified' && "bg-purple-100 text-purple-700",
                lead.status === 'converted' && "bg-accent-blue/20 text-accent-blue",
                lead.status === 'lost' && "bg-gray-100 text-gray-700"
              )}>
                {lead.status}
              </div>
            </div>
          </div>

          {/* Right side - Action indicator */}
          <div className="flex items-center">
            <ChevronRight className="w-5 h-5 text-text-tertiary" />
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

// Helper function to get temperature from score
function getTemperature(score: number): 'hot' | 'warm' | 'qualified' | 'cool' | 'early' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'qualified';
  if (score >= 20) return 'cool';
  return 'early';
}