'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  TrendingUp,
  Activity,
  Flame,
  Star,
  Diamond,
  Snowflake,
  Sprout,
  Calendar,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { GlassCard, GlassButton, glass } from '@/components/ui/glass';
import { getLeadStats } from '@/lib/firebase/leads';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { subscribeToDashboardStats } from '@/lib/firebase/admin-leads';
import { DashboardStatSkeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { Sparkline } from '@/components/admin/Sparkline';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalProjects: number;
  totalMessages: number;
  newLeadsToday: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageLeadScore: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: Date | Timestamp;
  }[];
  topProjects: any[];
}

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: duration / 1000 });
    return animation.stop;
  }, [value, count, duration]);

  return <motion.span>{rounded}</motion.span>;
}

// Temperature Badge Component with True Glass Morphism
function TemperatureBadge({ type, count }: { type: 'hot' | 'warm' | 'qualified' | 'cool' | 'early'; count: number }) {
  const config = {
    hot: { 
      icon: Flame, 
      color: 'red',
      accentColor: '#EF4444',
      label: 'Hot Leads'
    },
    warm: { 
      icon: Star, 
      color: 'orange',
      accentColor: '#F59E0B',
      label: 'Warm Leads'
    },
    qualified: { 
      icon: Diamond, 
      color: 'purple',
      accentColor: '#8B5CF6',
      label: 'Qualified'
    },
    cool: { 
      icon: Snowflake, 
      color: 'blue',
      accentColor: '#3B82F6',
      label: 'Cool Leads'
    },
    early: { 
      icon: Sprout, 
      color: 'green',
      accentColor: '#10B981',
      label: 'Early Stage'
    },
  };

  const { icon: Icon, color, accentColor, label } = config[type];

  // Generate mock sparkline data
  const sparklineData = Array.from({ length: 7 }, () => Math.random() * 50 + 20);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {/* Glass Card */}
      <GlassCard
        level="subtle"
        border="subtle"
        shadow="sm"
        radius="lg"
        hover
        className="overflow-hidden"
      >
        {/* Subtle accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
        />
        
        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className={cn("text-xs", glass.text.tertiary)}>{label}</p>
                <h3 className={cn("text-2xl font-semibold", glass.text.primary)}>
                  <AnimatedCounter value={count} />
                </h3>
              </div>
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="mt-3 opacity-50">
            <Sparkline 
              data={sparklineData} 
              width={100} 
              height={24}
              color={color}
              animate={false}
            />
          </div>
        </div>
        
        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
          whileHover={{ translateX: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </GlassCard>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { userProfile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeadsToday: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    averageLeadScore: 0,
    leadsByStatus: {},
    leadsBySource: {},
    recentActivity: [],
    topProjects: [],
    totalProjects: 0,
    totalMessages: 0
  });
  const [realtimeStats, setRealtimeStats] = useState({
    hotLeads: 0,
    warmLeads: 0,
    newToday: 0,
    completedQuestionnaires: 0,
    totalLeads: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    loadDashboardStats();
    
    // Set up real-time listener for lead stats
    const unsubscribe = subscribeToDashboardStats((liveStats) => {
      // Calculate trend
      const prevTotal = realtimeStats.totalLeads;
      if (liveStats.totalLeads > prevTotal) setTrend('up');
      else if (liveStats.totalLeads < prevTotal) setTrend('down');
      else setTrend('neutral');
      
      setRealtimeStats({
        hotLeads: liveStats.hotLeads,
        warmLeads: liveStats.warmLeads,
        newToday: liveStats.newToday,
        completedQuestionnaires: liveStats.completedQuestionnaires,
        totalLeads: liveStats.totalLeads
      });
      setStats(prev => ({
        ...prev,
        totalLeads: liveStats.totalLeads
      }));
    });
    
    return () => unsubscribe();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get lead statistics
      const leadStats = await getLeadStats();
      
      // Get projects count
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const totalProjects = projectsSnapshot.size;
      
      // Get messages count
      const messagesSnapshot = await getDocs(collection(db, 'contacts'));
      const totalMessages = messagesSnapshot.size;
      
      // Get new leads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const newLeadsQuery = query(
        collection(db, 'leads'),
        where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo))
      );
      const newLeadsSnapshot = await getDocs(newLeadsQuery);
      
      setStats({
        ...leadStats,
        totalProjects,
        totalMessages,
        newLeads: newLeadsSnapshot.size
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard', 'Please refresh the page to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'blue',
      change: `+${stats.newLeads} this week`
    },
    {
      label: 'Active Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'purple',
      change: 'All time'
    },
    {
      label: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'green',
      change: 'Unread: 0'
    },
    {
      label: 'Conversion Rate',
      value: stats.totalLeads > 0 
        ? `${Math.round((stats.leadsByStatus.converted || 0) / stats.totalLeads * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'pink',
      change: 'From leads'
    },
  ];

  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
    pink: 'from-pink-400 to-pink-600',
  };

  return (
    <div className="space-y-6">
      {/* Live Temperature Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h2 className={cn(glass.responsive.text.lg, "font-semibold flex items-center gap-2", glass.text.primary)}>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue" />
            Live Lead Status
          </h2>
          <div className={cn("flex items-center gap-2", glass.responsive.text.base, glass.text.secondary)}>
            <Clock className="w-4 h-4" />
            <span>Real-time</span>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
          </div>
        </div>
        
        {/* Temperature Grid */}
        <div className={cn("grid gap-3 sm:gap-4", glass.responsive.grid['2-3-4'])}>
          <TemperatureBadge type="hot" count={realtimeStats.hotLeads} />
          <TemperatureBadge type="warm" count={realtimeStats.warmLeads} />
          <TemperatureBadge type="qualified" count={stats.qualifiedLeads} />
          <TemperatureBadge type="cool" count={20} />
          <TemperatureBadge type="early" count={15} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className={cn("grid", glass.responsive.spacing.gap, glass.responsive.grid['1-2-4'])}>
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <DashboardStatSkeleton key={i} />
            ))}
          </>
        ) : (
          statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {/* Glass Card */}
              <GlassCard
                level="medium"
                border="subtle"
                shadow="md"
                radius="lg"
                hover
                className="h-full"
              >
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(glass.responsive.text.base, glass.text.secondary)}>{stat.label}</p>
                      <p className={cn(glass.responsive.text['2xl'], "font-semibold mt-2", glass.text.primary)}>
                        {typeof stat.value === 'number' ? (
                          <AnimatedCounter value={stat.value} />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className={cn("text-xs mt-1", glass.text.tertiary)}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl",
                      stat.color === 'blue' && "bg-blue-500/10",
                      stat.color === 'purple' && "bg-purple-500/10",
                      stat.color === 'green' && "bg-green-500/10",
                      stat.color === 'pink' && "bg-pink-500/10"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        stat.color === 'blue' && "text-blue-500",
                        stat.color === 'purple' && "text-purple-500",
                        stat.color === 'green' && "text-green-500",
                        stat.color === 'pink' && "text-pink-500"
                      )} />
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
                  whileHover={{ translateX: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </GlassCard>
            </motion.div>
            );
          })
        )}
      </div>

      {/* Activity Feed & Charts */}
      <div className={cn("grid", glass.responsive.spacing.gap, glass.responsive.grid['1-2'])}>
        {/* Lead Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard
            level="medium"
            border="subtle"
            shadow="md"
            radius="xl"
            className="h-full"
          >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn("text-lg font-semibold flex items-center gap-2", glass.text.primary)}>
                    <BarChart3 className="w-5 h-5 text-accent-purple" />
                    Lead Status Distribution
                  </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-accent-blue hover:underline"
              >
                View Details
              </motion.button>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.leadsByStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span className={cn("text-sm capitalize", glass.text.secondary)}>
                      {status}
                    </span>
                    <span className={cn("text-sm", glass.text.primary)}>{count}</span>
                  </div>
                  <div className="w-full bg-white/10 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%` 
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gray-900 dark:bg-white h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard
            level="medium"
            border="subtle"
            shadow="md"
            radius="xl"
            className="h-full"
          >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("text-lg font-semibold flex items-center gap-2", glass.text.primary)}>
                  <Activity className="w-5 h-5 text-accent-green" />
                  Recent Activity
                </h3>
                <span className={cn("text-xs", glass.text.tertiary)}>
                  Live feed
                </span>
              </div>
              <ActivityFeed />
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Glass Container */}
        <GlassCard
          level="medium"
          border="subtle"
          shadow="md"
          radius="xl"
        >
          <h3 className={cn("text-lg font-semibold mb-4", glass.text.primary)}>
            Quick Actions
          </h3>
          <div className={cn("grid", glass.responsive.spacing['gap-sm'], glass.responsive.grid['2-3-4'])}>
            <Link href="/admin/leads">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl transition-all text-center w-full group",
                  glass.levels.ultraSubtle.combined,
                  "hover:bg-white/10"
                )}
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-accent-blue group-hover:scale-110 transition-transform" />
                <span className={cn("text-sm", glass.text.primary)}>View Leads</span>
              </motion.button>
            </Link>
            <Link href="/admin/projects">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl transition-all text-center w-full group",
                  glass.levels.ultraSubtle.combined,
                  "hover:bg-white/10"
                )}
              >
                <FolderOpen className="w-6 h-6 mx-auto mb-2 text-accent-purple group-hover:scale-110 transition-transform" />
                <span className={cn("text-sm", glass.text.primary)}>Manage Projects</span>
              </motion.button>
            </Link>
            <Link href="/admin/messages">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl transition-all text-center w-full group",
                  glass.levels.ultraSubtle.combined,
                  "hover:bg-white/10"
                )}
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-accent-green group-hover:scale-110 transition-transform" />
                <span className={cn("text-sm", glass.text.primary)}>Check Messages</span>
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group"
            >
              <Activity className="w-6 h-6 mx-auto mb-2 text-accent-pink group-hover:scale-110 transition-transform" />
              <span className={cn("text-sm", glass.text.primary)}>View Analytics</span>
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}