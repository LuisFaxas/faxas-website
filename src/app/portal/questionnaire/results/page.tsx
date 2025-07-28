'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  LeadScoreBreakdown, 
  QuestionnaireSession,
  getTemperatureEmoji 
} from '@/types/portal';
import { getScoreInterpretation } from '@/lib/portal/scoring';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { 
  Trophy,
  TrendingUp,
  Clock,
  Briefcase,
  DollarSign,
  Download,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function QuestionnaireResultsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<QuestionnaireSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadResults();
    }
  }, [user]);

  const loadResults = async () => {
    if (!user) return;

    try {
      const sessionDoc = await getDoc(doc(db, 'questionnaire_sessions', user.uid));
      
      if (!sessionDoc.exists() || sessionDoc.data().status !== 'completed') {
        // No completed session - redirect back to questionnaire
        router.push('/portal/questionnaire');
        return;
      }

      setSession(sessionDoc.data() as QuestionnaireSession);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.score) {
    return null;
  }

  const score = session.score;
  const interpretation = getScoreInterpretation(score);
  const temperatureEmoji = getTemperatureEmoji(score.temperature);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Your Project Assessment Results
        </h1>
        <p className="text-xl text-text-secondary">
          Based on your responses, here's what we recommend
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <GlassPanel level="primary" className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">{temperatureEmoji}</div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {interpretation.title}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {interpretation.description}
            </p>
          </div>

          {/* Score Display */}
          <div className="inline-flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-text-primary">{score.total}</span>
            <span className="text-2xl text-text-secondary">/100</span>
          </div>

          {/* Temperature Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            score.temperature === 'hot' ? 'bg-red-100 text-red-700' :
            score.temperature === 'warm' ? 'bg-orange-100 text-orange-700' :
            score.temperature === 'qualified' ? 'bg-yellow-100 text-yellow-700' :
            score.temperature === 'cool' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            <Trophy className="w-5 h-5" />
            <span className="font-semibold capitalize">{score.temperature} Lead</span>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <h3 className="text-xl font-bold text-text-primary mb-4">Score Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Budget */}
          <GlassPanel level="secondary" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent-green" />
                <span className="font-medium text-text-primary">Budget Alignment</span>
              </div>
              <span className="text-lg font-bold text-text-primary">{score.budget}/35</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-accent-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${(score.budget / 35) * 100}%` }}
              />
            </div>
          </GlassPanel>

          {/* Timeline */}
          <GlassPanel level="secondary" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-orange" />
                <span className="font-medium text-text-primary">Timeline Urgency</span>
              </div>
              <span className="text-lg font-bold text-text-primary">{score.timeline}/25</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-accent-orange h-2 rounded-full transition-all duration-500"
                style={{ width: `${(score.timeline / 25) * 100}%` }}
              />
            </div>
          </GlassPanel>

          {/* Authority */}
          <GlassPanel level="secondary" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent-purple" />
                <span className="font-medium text-text-primary">Decision Authority</span>
              </div>
              <span className="text-lg font-bold text-text-primary">{score.authority}/15</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-accent-purple h-2 rounded-full transition-all duration-500"
                style={{ width: `${(score.authority / 15) * 100}%` }}
              />
            </div>
          </GlassPanel>

          {/* Complexity & Engagement */}
          <GlassPanel level="secondary" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent-blue" />
                <span className="font-medium text-text-primary">Project Fit</span>
              </div>
              <span className="text-lg font-bold text-text-primary">
                {score.complexity + score.engagement}/25
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-accent-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${((score.complexity + score.engagement) / 25) * 100}%` }}
              />
            </div>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <h3 className="text-xl font-bold text-text-primary mb-4">Your Next Steps</h3>
        <GlassPanel level="secondary" className="p-6">
          <div className="space-y-4">
            {interpretation.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-accent-blue" />
                </div>
                <p className="text-text-primary">{step}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {interpretation.priority === 'immediate' || interpretation.priority === 'high' ? (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.open('https://calendly.com/faxas', '_blank')}
                className="flex-1 gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule a Call
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/portal/dashboard')}
                className="flex-1 gap-2"
              >
                <Download className="w-5 h-5" />
                Download Project Brief
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/portal/resources')}
                className="flex-1 gap-2"
              >
                View Resources
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/portal/dashboard')}
                className="flex-1 gap-2"
              >
                Go to Dashboard
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}