'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  PortalDashboardData, 
  PortalUser, 
  getTemperatureEmoji 
} from '@/types/portal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
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
  AlertCircle
} from 'lucide-react';

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
      
      // Mock dashboard data for now
      const mockData: PortalDashboardData = {
        user: portalUser,
        questionnaire: sessionDoc.exists() ? {
          status: sessionDoc.data().status || 'not_started',
          completionPercentage: sessionDoc.data().responses?.length * 10 || 0,
          responses: sessionDoc.data().responses || [],
          score: sessionDoc.data().score || undefined,
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
          ],
          downloaded: [],
        },
        nextSteps: [
          {
            id: '1',
            title: 'Complete Your Project Questionnaire',
            description: 'Help us understand your needs better',
            action: {
              type: 'button',
              label: 'Start Questionnaire',
              handler: '/portal/questionnaire',
            },
            priority: 'high',
          },
          {
            id: '2',
            title: 'Schedule a Discovery Call',
            description: 'Book a 30-minute call to discuss your project',
            action: {
              type: 'link',
              label: 'Book Call',
              url: 'https://calendly.com/faxas',
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
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="h-32 bg-white/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { user: portalUser, questionnaire, resources, nextSteps } = dashboardData;

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {portalUser.displayName}!
        </h1>
        <p className="text-text-secondary">
          {questionnaire?.status === 'completed' 
            ? "Here's your project dashboard and next steps."
            : "Let's continue building your perfect web solution."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Questionnaire Status */}
        <GlassPanel level="light" className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Questionnaire</p>
              <p className="text-2xl font-bold text-text-primary">
                {questionnaire?.completionPercentage || 0}%
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {questionnaire?.status === 'completed' ? 'Completed' : 'In Progress'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              questionnaire?.status === 'completed' ? 'bg-green-100' : 'bg-accent-blue/20'
            }`}>
              {questionnaire?.status === 'completed' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <FileText className="w-6 h-6 text-accent-blue" />
              )}
            </div>
          </div>
          {questionnaire?.status !== 'completed' && (
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-4"
              onClick={() => router.push('/portal/questionnaire')}
            >
              Continue Questionnaire
            </Button>
          )}
        </GlassPanel>

        {/* Lead Score */}
        {questionnaire?.score && (
          <GlassPanel level="light" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Your Score</p>
                <p className="text-2xl font-bold text-text-primary">
                  {questionnaire.score.total}/100
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {getTemperatureEmoji(questionnaire.score.temperature)} {questionnaire.score.temperature}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-purple" />
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Journey Stage */}
        <GlassPanel level="light" className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Journey Stage</p>
              <p className="text-2xl font-bold text-text-primary capitalize">
                {portalUser.journeyStage}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {portalUser.milestones.length} milestones
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-green" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Your Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {nextSteps.map((step) => (
            <GlassPanel key={step.id} level="secondary" className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.priority === 'high' 
                    ? 'bg-accent-red/20' 
                    : step.priority === 'medium'
                    ? 'bg-accent-orange/20'
                    : 'bg-accent-blue/20'
                }`}>
                  {step.priority === 'high' ? (
                    <AlertCircle className="w-5 h-5 text-accent-red" />
                  ) : (
                    <Clock className="w-5 h-5 text-accent-orange" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{step.description}</p>
                  {step.action.type === 'button' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(step.action.handler || '/')}
                    >
                      {step.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <a
                      href={step.action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium inline-flex items-center gap-1"
                    >
                      {step.action.label}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Recommended Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.recommended.map((resource) => (
            <GlassPanel key={resource.id} level="secondary" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-accent-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-1">{resource.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{resource.description}</p>
                  <button className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium inline-flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download {resource.type}
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}