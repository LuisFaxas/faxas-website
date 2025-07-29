'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  PortalDashboardData, 
  PortalUser, 
  getTemperatureEmoji,
  QuestionnaireSession 
} from '@/types/portal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  BookOpen,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Target,
  Users,
  BarChart3,
  Rocket,
  Shield,
  Zap,
  Star,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Activity,
  Award,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Floating decorative elements
function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-[20%] left-[10%] w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-3xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-tr from-accent-blue/10 to-accent-green/10 rounded-full blur-3xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
}

// Progress Ring Component
function ProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  color = 'accent-blue' 
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-black/10"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-accent-blue"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
}


export default function PortalDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<PortalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        router.push('/portal/start');
        return;
      }

      const portalUser = userDoc.data() as PortalUser;

      // Load questionnaire session
      const sessionDoc = await getDoc(doc(db, 'questionnaire_sessions', user.uid));
      
      // If user is a lead and hasn't completed questionnaire, redirect
      if (portalUser.role === 'lead') {
        if (!sessionDoc.exists() || sessionDoc.data().status !== 'completed') {
          router.push('/portal/questionnaire');
          return;
        }
      }

      const sessionData = sessionDoc.exists() ? sessionDoc.data() as QuestionnaireSession : null;
      
      // Build dashboard data
      const mockData: PortalDashboardData = {
        user: portalUser,
        questionnaire: sessionData ? {
          status: sessionData.status || 'not_started',
          completionPercentage: 100,
          responses: sessionData.responses || [],
          score: sessionData.scoreBreakdown,
        } : {
          status: 'not_started',
          completionPercentage: 0,
        },
        resources: {
          recommended: [
            {
              id: '1',
              title: 'Web Development Process Guide',
              description: 'Learn about our development process from start to finish',
              type: 'guide',
              url: '/resources/process-guide.pdf',
              relevanceScore: 95,
            },
            {
              id: '2',
              title: 'Project Planning Template',
              description: 'Use this template to outline your project requirements',
              type: 'template',
              url: '/resources/planning-template.xlsx',
              relevanceScore: 88,
            },
            {
              id: '3',
              title: 'Design System Examples',
              description: 'Browse through modern design system implementations',
              type: 'case_study',
              url: '/resources/design-systems.pdf',
              relevanceScore: 82,
            },
          ],
          downloaded: [],
        },
        nextSteps: [
          {
            id: '1',
            title: 'Schedule Discovery Call',
            description: 'Book a 30-minute call to discuss your project in detail',
            action: {
              type: 'link',
              label: 'Book Call',
              url: 'https://calendly.com/faxas',
            },
            priority: 'high',
          },
          {
            id: '2',
            title: 'Review Proposal',
            description: 'We\'re preparing a custom proposal based on your needs',
            action: {
              type: 'button',
              label: 'Coming Soon',
              handler: '/portal/proposals',
            },
            priority: 'medium',
          },
        ],
        communications: [],
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end flex items-center justify-center">
        <AnimatedBackground />
        <GlassPanel level="primary" className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
            <p className="text-white/80">Loading your dashboard...</p>
          </div>
        </GlassPanel>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { user: portalUser, questionnaire, resources, nextSteps } = dashboardData;

  // Calculate journey progress
  const journeyProgress = (() => {
    if (portalUser.role === 'client') return 100;
    if (portalUser.role === 'qualified_lead') return 75;
    if (questionnaire?.status === 'completed') return 50;
    if (portalUser.milestones.length > 0) return 25;
    return 10;
  })();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      

      <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
              Welcome back, {portalUser.displayName}!
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>

          {/* Journey Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassPanel level="primary" className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <ProgressRing 
                    percentage={journeyProgress} 
                    size={100}
                    strokeWidth={8}
                    color="accent-blue"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                    Your Project Journey
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base mb-4">
                    {journeyProgress < 50 
                      ? "You're in the discovery phase. Let's explore your project needs together."
                      : journeyProgress < 100
                      ? "Great progress! We're preparing your personalized proposal."
                      : "Welcome to the development phase! Your project is underway."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {portalUser.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs"
                      >
                        <CheckCircle className="w-3 h-3 text-accent-green" />
                        <span className="text-text-secondary capitalize">
                          {milestone.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {questionnaire?.score && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-full">
                    <span className="text-2xl">{getTemperatureEmoji(questionnaire.score.temperature)}</span>
                    <div>
                      <p className="text-xs text-white/70">Project Score</p>
                      <p className="text-lg font-bold text-white">{questionnaire.score.total}/100</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                icon: Activity,
                label: 'Journey Stage',
                value: portalUser.journeyStage.replace(/_/g, ' '),
                color: 'from-accent-blue to-accent-purple',
              },
              {
                icon: Award,
                label: 'Portal Status',
                value: portalUser.role.replace(/_/g, ' '),
                color: 'from-accent-green to-accent-blue',
              },
              {
                icon: FileText,
                label: 'Resources',
                value: `${resources.recommended.length} Available`,
                color: 'from-accent-purple to-accent-pink',
              },
              {
                icon: Bell,
                label: 'Next Steps',
                value: `${nextSteps.length} Pending`,
                color: 'from-accent-orange to-accent-red',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <GlassPanel level="secondary" className="p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                      stat.color
                    )}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-text-primary capitalize">{stat.value}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>

          {/* Next Steps & Resources Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-blue" />
                Your Next Steps
              </h3>
              <div className="space-y-3">
                {nextSteps.map((step) => (
                  <GlassPanel key={step.id} level="secondary" className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        step.priority === 'high' 
                          ? 'bg-gradient-to-br from-accent-red/20 to-accent-orange/20' 
                          : 'bg-gradient-to-br from-accent-blue/20 to-accent-purple/20'
                      )}>
                        {step.priority === 'high' ? (
                          <AlertCircle className="w-4 h-4 text-accent-red" />
                        ) : (
                          <Clock className="w-4 h-4 text-accent-blue" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary text-sm sm:text-base mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary mb-3">
                          {step.description}
                        </p>
                        {step.action.type === 'link' ? (
                          <a
                            href={step.action.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-purple transition-colors text-sm font-medium"
                          >
                            {step.action.label}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                            disabled={step.action.label === 'Coming Soon'}
                          >
                            {step.action.label}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-purple" />
                Recommended Resources
              </h3>
              <div className="space-y-3">
                {resources.recommended.map((resource) => (
                  <GlassPanel key={resource.id} level="secondary" className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center flex-shrink-0">
                        {resource.type === 'guide' && <BookOpen className="w-4 h-4 text-accent-purple" />}
                        {resource.type === 'template' && <FileText className="w-4 h-4 text-accent-purple" />}
                        {resource.type === 'case_study' && <BarChart3 className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary text-sm sm:text-base mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary mb-3">
                          {resource.description}
                        </p>
                        <button className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-pink transition-colors text-sm font-medium">
                          <Download className="w-3 h-3" />
                          Download {resource.type.replace('_', ' ')}
                        </button>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassPanel level="primary" className="p-6 sm:p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Need Help?
                </h3>
                <p className="text-text-secondary mb-6 text-sm sm:text-base">
                  Our team is here to help you succeed. Reach out anytime!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:hello@faxas.net"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/5 hover:bg-black/10 border border-black/10 rounded-xl transition-all text-sm font-medium text-text-primary"
                  >
                    <Mail className="w-4 h-4" />
                    hello@faxas.net
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/5 hover:bg-black/10 border border-black/10 rounded-xl transition-all text-sm font-medium text-text-primary"
                  >
                    <Phone className="w-4 h-4" />
                    (123) 456-7890
                  </a>
                  <Link
                    href="/portal/messages"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </Link>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
      </div>
    </div>
  );
}