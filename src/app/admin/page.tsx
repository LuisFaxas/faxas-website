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
import { GlassPanel } from '@/components/ui/glass/glass-panel';
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
    timestamp: Timestamp;
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

// Temperature Badge Component
function TemperatureBadge({ type, count }: { type: 'hot' | 'warm' | 'qualified' | 'cool' | 'early'; count: number }) {
  const config = {
    hot: { icon: Flame, color: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50', emoji: '🔥' },
    warm: { icon: Star, color: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/50', emoji: '🌟' },
    qualified: { icon: Diamond, color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/50', emoji: '💎' },
    cool: { icon: Snowflake, color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50', emoji: '❄️' },
    early: { icon: Sprout, color: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/50', emoji: '🌱' },
  };

  const { icon: Icon, color, glow, emoji } = config[type];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <GlassPanel level="secondary" className={cn(
        "p-4 text-center overflow-hidden",
        `hover:${glow} hover:shadow-lg transition-all duration-300`
      )}>
        <div className={cn(
          "absolute inset-0 opacity-20 bg-gradient-to-br",
          color
        )} />
        <div className="relative z-10">
          <div className="text-2xl mb-1">{emoji}</div>
          <div className="text-2xl font-bold text-text-primary">
            <AnimatedCounter value={count} />
          </div>
          <div className="text-xs text-text-secondary capitalize">
            {type} Leads
          </div>
        </div>
      </GlassPanel>
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent-blue" />
            Live Lead Status
          </h2>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="w-4 h-4" />
            <span>Real-time</span>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
          </div>
        </div>
        
        {/* Temperature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TemperatureBadge type="hot" count={realtimeStats.hotLeads} />
          <TemperatureBadge type="warm" count={realtimeStats.warmLeads} />
          <TemperatureBadge type="qualified" count={stats.qualifiedLeads} />
          <TemperatureBadge type="cool" count={20} />
          <TemperatureBadge type="early" count={15} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              whileHover={{ y: -4 }}
            >
              <GlassPanel level="secondary" className="p-6 h-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-secondary text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-primary mt-2">
                      {typeof stat.value === 'number' ? (
                        <AnimatedCounter value={stat.value} />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 5 }}
                    className={cn(
                      "p-3 rounded-lg bg-gradient-to-br text-white",
                      colorClasses[stat.color as keyof typeof colorClasses]
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                </div>
              </GlassPanel>
            </motion.div>
            );
          })
        )}
      </div>

      {/* Activity Feed & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel level="primary" className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
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
                    <span className="text-sm text-text-secondary capitalize">
                      {status}
                    </span>
                    <span className="text-sm text-text-primary">{count}</span>
                  </div>
                  <div className="w-full bg-glass-lighter rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%` 
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassPanel level="primary" className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-green" />
                Recent Activity
              </h3>
              <span className="text-xs text-text-secondary">
                Live feed
              </span>
            </div>
            <ActivityFeed />
          </GlassPanel>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassPanel level="primary" className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/leads">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all text-center w-full group"
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-accent-blue group-hover:scale-110 transition-transform" />
                <span className="text-sm text-text-primary">View Leads</span>
              </motion.button>
            </Link>
            <Link href="/admin/projects">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all text-center w-full group"
              >
                <FolderOpen className="w-6 h-6 mx-auto mb-2 text-accent-purple group-hover:scale-110 transition-transform" />
                <span className="text-sm text-text-primary">Manage Projects</span>
              </motion.button>
            </Link>
            <Link href="/admin/messages">
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all text-center w-full group"
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-accent-green group-hover:scale-110 transition-transform" />
                <span className="text-sm text-text-primary">Check Messages</span>
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all text-center group"
            >
              <Activity className="w-6 h-6 mx-auto mb-2 text-accent-pink group-hover:scale-110 transition-transform" />
              <span className="text-sm text-text-primary">View Analytics</span>
            </motion.button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}