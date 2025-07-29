'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  TrendingUp,
  Activity
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

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalProjects: number;
  totalMessages: number;
  leadsByStatus: Record<string, number>;
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: Timestamp;
  }[];
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
    completedQuestionnaires: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    
    // Set up real-time listener for lead stats
    const unsubscribe = subscribeToDashboardStats((liveStats) => {
      setRealtimeStats({
        hotLeads: liveStats.hotLeads,
        warmLeads: liveStats.warmLeads,
        newToday: liveStats.newToday,
        completedQuestionnaires: liveStats.completedQuestionnaires
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
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Welcome back, {userProfile?.displayName || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="secondary" size="sm">
                View Site
              </Button>
            </Link>
            <Button variant="primary" size="sm">
              <Activity className="w-4 h-4" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-red-600">{realtimeStats.hotLeads}</div>
          <div className="text-xs text-text-secondary">Hot Leads</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🌟</div>
          <div className="text-2xl font-bold text-yellow-600">{realtimeStats.warmLeads}</div>
          <div className="text-xs text-text-secondary">Warm Leads</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🆕</div>
          <div className="text-2xl font-bold text-green-600">{realtimeStats.newToday}</div>
          <div className="text-xs text-text-secondary">New Today</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-bold text-purple-600">{realtimeStats.completedQuestionnaires}</div>
          <div className="text-xs text-text-secondary">Completed Forms</div>
        </GlassPanel>
      </div>

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
            >
              <GlassPanel className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-secondary text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-primary mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
            );
          })
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Lead Status Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.leadsByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary capitalize">
                    {status}
                  </span>
                  <span className="text-sm text-text-primary">{count}</span>
                </div>
                <div className="w-full bg-glass-lighter rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Recent Activity */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-blue rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">{activity.description}</p>
                    <p className="text-xs text-text-tertiary">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-sm">No recent activity</p>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* Quick Actions */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/leads">
            <button className="p-4 rounded-lg bg-glass-light hover:bg-glass-lighter transition-colors text-center w-full">
              <Users className="w-6 h-6 mx-auto mb-2 text-accent-blue" />
              <span className="text-sm text-text-primary">View Leads</span>
            </button>
          </Link>
          <Link href="/admin/projects">
            <button className="p-4 rounded-lg bg-glass-light hover:bg-glass-lighter transition-colors text-center w-full">
              <FolderOpen className="w-6 h-6 mx-auto mb-2 text-accent-purple" />
              <span className="text-sm text-text-primary">Manage Projects</span>
            </button>
          </Link>
          <Link href="/admin/messages">
            <button className="p-4 rounded-lg bg-glass-light hover:bg-glass-lighter transition-colors text-center w-full">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-accent-green" />
              <span className="text-sm text-text-primary">Check Messages</span>
            </button>
          </Link>
          <button className="p-4 rounded-lg bg-glass-light hover:bg-glass-lighter transition-colors text-center">
            <Activity className="w-6 h-6 mx-auto mb-2 text-accent-pink" />
            <span className="text-sm text-text-primary">View Analytics</span>
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}