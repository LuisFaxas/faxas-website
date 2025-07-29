'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { QuestionCard } from '@/components/portal/questionnaire/QuestionCard';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Loader2 } from 'lucide-react';
import { questions, getQuestionFlow, questionnaireVersion } from '@/lib/portal/questionnaire-config';
import { calculateLeadScore } from '@/lib/portal/scoring';
import { 
  QuestionnaireResponse, 
  QuestionnaireSession,
  Question,
  getPortalFeatures 
} from '@/types/portal';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc,
  arrayUnion 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/components/ui/toast';
import { trackAnalyticsEvent } from '@/lib/firebase/db';

export default function QuestionnairePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, any>>(new Map());
  const [sessionId, setSessionId] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);

  const questionFlow = getQuestionFlow(responses);
  const currentQuestion = questionFlow[currentQuestionIndex];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questionFlow.length - 1;

  useEffect(() => {
    if (user) {
      loadOrCreateSession();
    }
  }, [user]);

  const loadOrCreateSession = async () => {
    if (!user) return;

    try {
      const sessionDoc = await getDoc(doc(db, 'questionnaire_sessions', user.uid));
      
      if (sessionDoc.exists()) {
        const session = sessionDoc.data() as QuestionnaireSession;
        
        if (session.status === 'completed') {
          // Already completed - redirect to results
          router.push('/portal/questionnaire/results');
          return;
        }

        // Resume session
        const responseMap = new Map(
          session.responses.map(r => [r.questionId, r.value])
        );
        setResponses(responseMap);
        setSessionId(session.id);
        
        // Find where they left off
        const lastAnsweredIndex = questions.findIndex(
          q => q.id === session.lastQuestionId
        );
        setCurrentQuestionIndex(Math.max(0, lastAnsweredIndex));
      } else {
        // Create new session
        const newSessionId = `session_${user.uid}_${Date.now()}`;
        const newSession: QuestionnaireSession = {
          id: newSessionId,
          userId: user.uid,
          startedAt: serverTimestamp() as any,
          responses: [],
          status: 'in_progress',
          version: questionnaireVersion,
        };
        
        await setDoc(doc(db, 'questionnaire_sessions', user.uid), newSession);
        setSessionId(newSessionId);

        // Track analytics
        await trackAnalyticsEvent('questionnaire_started', {
          sessionId: newSessionId,
          version: questionnaireVersion,
        });
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!user || !sessionId) return;

    try {
      const now = new Date();
      const responseArray: QuestionnaireResponse[] = Array.from(responses.entries()).map(
        ([questionId, value]) => ({
          questionId,
          value,
          answeredAt: now,
          timeSpent: Math.round((Date.now() - questionStartTime) / 1000),
        })
      );

      await updateDoc(doc(db, 'questionnaire_sessions', user.uid), {
        responses: responseArray,
        lastQuestionId: currentQuestion?.id,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = (value: any) => {
    const newResponses = new Map(responses);
    newResponses.set(currentQuestion.id, value);
    setResponses(newResponses);
  };

  const handleNext = async () => {
    // Save response timing
    await saveProgress();

    if (isLast) {
      // Complete questionnaire
      await completeQuestionnaire();
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const completeQuestionnaire = async () => {
    if (!user || !sessionId) return;

    try {
      // Calculate score
      const score = calculateLeadScore(responses);
      
      // Update session as completed
      const now = new Date();
      const responseArray: QuestionnaireResponse[] = Array.from(responses.entries()).map(
        ([questionId, value]) => ({
          questionId,
          value,
          answeredAt: now,
          timeSpent: Math.round((Date.now() - questionStartTime) / 1000),
        })
      );

      await updateDoc(doc(db, 'questionnaire_sessions', user.uid), {
        responses: responseArray,
        completedAt: serverTimestamp(),
        status: 'completed',
        score: score.total,
        scoreBreakdown: score,
      });

      // Update user document with questionnaire completion milestone
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedMilestones = [...(userData.milestones || []), {
          type: 'questionnaire_completed',
          timestamp: new Date(),
          metadata: { 
            score: score.total,
            temperature: score.temperature 
          }
        }];
        
        await updateDoc(userRef, {
          milestones: updatedMilestones,
          journeyStage: 'evaluating',
          updatedAt: serverTimestamp(),
        });
      }

      // Track analytics
      await trackAnalyticsEvent('questionnaire_completed', {
        sessionId,
        score: score.total,
        temperature: score.temperature,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        version: questionnaireVersion,
      });

      // Show success and redirect
      toast.success('Questionnaire completed!', 'Calculating your results...');
      
      setTimeout(() => {
        router.push('/portal/questionnaire/results');
      }, 1500);
      
    } catch (error) {
      console.error('Error completing questionnaire:', error);
      toast.error('Failed to save questionnaire');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-primary p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
              <p className="text-text-secondary">Loading questionnaire...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary">No more questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-3xl"
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
        className="absolute bottom-40 right-40 w-40 h-40 bg-gradient-to-tr from-accent-blue/20 to-accent-green/20 rounded-full blur-3xl"
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
      
      <div className="relative z-10 min-h-screen p-4 md:p-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={responses.get(currentQuestion.id)}
            onChange={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={isFirst}
            isLast={isLast}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}