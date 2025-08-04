'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Star,
  Clock,
  Flame,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  UserPlus,
  Mail,
  Calendar
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface ActivityItem {
  id: string;
  type: 'new_lead' | 'lead_update' | 'questionnaire_complete' | 'message' | 'project_update';
  title: string;
  description: string;
  timestamp: Timestamp;
  icon: React.ElementType;
  color: string;
  metadata?: {
    leadScore?: number;
    leadName?: string;
    projectName?: string;
    temperature?: 'hot' | 'warm' | 'qualified' | 'cool' | 'early';
  };
}

const getActivityIcon = (type: ActivityItem['type']): React.ElementType => {
  switch (type) {
    case 'new_lead': return UserPlus;
    case 'lead_update': return TrendingUp;
    case 'questionnaire_complete': return CheckCircle;
    case 'message': return MessageSquare;
    case 'project_update': return FileText;
    default: return AlertCircle;
  }
};

const getActivityColor = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'new_lead': return 'from-blue-500 to-cyan-500';
    case 'lead_update': return 'from-purple-500 to-pink-500';
    case 'questionnaire_complete': return 'from-green-500 to-emerald-500';
    case 'message': return 'from-yellow-500 to-orange-500';
    case 'project_update': return 'from-indigo-500 to-purple-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getTemperatureEmoji = (temperature?: string): string => {
  switch (temperature) {
    case 'hot': return '🔥';
    case 'warm': return '🌟';
    case 'qualified': return '💎';
    case 'cool': return '❄️';
    case 'early': return '🌱';
    default: return '';
  }
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time activity updates
    const q = query(
      collection(db, 'activity_feed'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newActivities: ActivityItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        icon: getActivityIcon(doc.data().type),
        color: getActivityColor(doc.data().type),
      } as ActivityItem));

      setActivities(newActivities);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching activities:', error);
      // Fallback to mock data for demo
      setActivities(getMockActivities());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Premium Glass Card */}
              <div className="relative rounded-xl p-[1px] overflow-hidden group cursor-pointer">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 group-hover:from-accent-blue/20 group-hover:to-accent-purple/20 transition-all duration-300" />
                
                {/* Inner Card */}
                <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-xl">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-30" />
                  
                  {/* Content */}
                  <div className="relative p-4">
                    <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
                      activity.color
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-blue group-hover:to-accent-purple group-hover:bg-clip-text transition-all">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {activity.description}
                        </p>
                        
                        {/* Metadata Pills */}
                        {activity.metadata && (
                          <div className="flex items-center gap-2 mt-2">
                            {activity.metadata.leadScore && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-xs font-medium">
                                <Star className="w-3 h-3" />
                                Score: {activity.metadata.leadScore}
                              </span>
                            )}
                            {activity.metadata.temperature && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                                {getTemperatureEmoji(activity.metadata.temperature)}
                                {activity.metadata.temperature}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs whitespace-nowrap">
                          {formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                  
                  {/* Hover Shine Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}

// Mock data for demo purposes
function getMockActivities(): ActivityItem[] {
  return [
    {
      id: '1',
      type: 'new_lead',
      title: 'New lead from portal',
      description: 'Sarah Johnson completed the questionnaire',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)),
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      metadata: {
        leadScore: 85,
        temperature: 'hot',
        leadName: 'Sarah Johnson'
      }
    },
    {
      id: '2',
      type: 'questionnaire_complete',
      title: 'Questionnaire completed',
      description: 'Michael Chen finished all 11 questions',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      metadata: {
        leadScore: 72,
        temperature: 'warm'
      }
    },
    {
      id: '3',
      type: 'lead_update',
      title: 'Lead status changed',
      description: 'Emma Davis moved to qualified',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      metadata: {
        temperature: 'qualified'
      }
    },
    {
      id: '4',
      type: 'message',
      title: 'New message received',
      description: 'Robert Wilson sent a project inquiry',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
      icon: MessageSquare,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '5',
      type: 'project_update',
      title: 'Project milestone reached',
      description: 'TechCorp website reached 50% completion',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      icon: FileText,
      color: 'from-indigo-500 to-purple-500',
      metadata: {
        projectName: 'TechCorp Website'
      }
    }
  ];
}