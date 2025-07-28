'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { QuestionCard } from '@/components/portal/questionnaire/QuestionCard';
import { questions, getQuestionFlow, questionnaireVersion } from '@/lib/portal/questionnaire-config';
import { calculateLeadScore } from '@/lib/portal/scoring';
import { 
  QuestionnaireResponse, 
  QuestionnaireSession,
  Question 
} from '@/types/portal';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc 
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
  const isLast = currentQuestionIndex === questions.length - 1 || 
                 !questions.some(q => !responses.has(q.id) && !questionFlow.includes(q));

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
      const responseArray: QuestionnaireResponse[] = Array.from(responses.entries()).map(
        ([questionId, value]) => ({
          questionId,
          value,
          answeredAt: serverTimestamp() as any,
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
      const responseArray: QuestionnaireResponse[] = Array.from(responses.entries()).map(
        ([questionId, value]) => ({
          questionId,
          value,
          answeredAt: serverTimestamp() as any,
          timeSpent: Math.round((Date.now() - questionStartTime) / 1000),
        })
      );

      await updateDoc(doc(db, 'questionnaire_sessions', user.uid), {
        responses: responseArray,
        completedAt: serverTimestamp(),
        status: 'completed',
        score,
      });

      // Update user's lead record with score
      await updateDoc(doc(db, 'leads', user.uid), {
        score: score.total,
        questionnaire: {
          completed: true,
          completedAt: serverTimestamp(),
          responses: Object.fromEntries(responses),
        },
        updatedAt: serverTimestamp(),
      });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading questionnaire...</p>
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
    <div className="min-h-screen p-4 md:p-8">
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
  );
}