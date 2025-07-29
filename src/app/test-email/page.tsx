'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { welcomeEmailTemplate } from '@/lib/email/templates/welcome-email';
import { questionnaireCompleteTemplate } from '@/lib/email/templates/questionnaire-complete';
import { LeadScoreBreakdown } from '@/types/portal';

export default function TestEmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'questionnaire' | 'hotlead'>('welcome');

  // Sample data
  const sampleScore: LeadScoreBreakdown = {
    budget: 30,
    timeline: 20,
    authority: 12,
    complexity: 10,
    engagement: 8,
    total: 80,
    temperature: 'hot',
  };

  const sampleResponses = [
    { question: 'What type of project are you looking for?', answer: 'Complete website redesign' },
    { question: 'What is your budget range?', answer: '$25,000 - $50,000' },
    { question: 'When do you need this completed?', answer: 'Within 1-2 months' },
    { question: 'What is your role?', answer: 'CEO / Founder' },
    { question: 'Do you have an existing website?', answer: 'Yes' },
  ];

  const getEmailHtml = () => {
    switch (selectedTemplate) {
      case 'welcome':
        return welcomeEmailTemplate({
          userName: 'John Doe',
          userEmail: 'john@example.com',
        });
      case 'questionnaire':
        return questionnaireCompleteTemplate({
          leadName: 'Jane Smith',
          leadEmail: 'jane@techcorp.com',
          leadCompany: 'TechCorp Inc.',
          score: { ...sampleScore, total: 65, temperature: 'warm' },
          temperature: 'Warm',
          temperatureEmoji: '🌟',
          responses: sampleResponses,
          isHotLead: false,
        });
      case 'hotlead':
        return questionnaireCompleteTemplate({
          leadName: 'Mike Johnson',
          leadEmail: 'mike@enterprise.com',
          leadCompany: 'Enterprise Solutions Ltd.',
          score: sampleScore,
          temperature: 'Hot',
          temperatureEmoji: '🔥',
          responses: sampleResponses,
          isHotLead: true,
        });
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Email Template Preview</h1>
        
        <GlassPanel level="primary" className="p-6 mb-8">
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant={selectedTemplate === 'welcome' ? 'primary' : 'secondary'}
              onClick={() => setSelectedTemplate('welcome')}
            >
              Welcome Email
            </Button>
            <Button
              variant={selectedTemplate === 'questionnaire' ? 'primary' : 'secondary'}
              onClick={() => setSelectedTemplate('questionnaire')}
            >
              Questionnaire Complete (Warm)
            </Button>
            <Button
              variant={selectedTemplate === 'hotlead' ? 'primary' : 'secondary'}
              onClick={() => setSelectedTemplate('hotlead')}
            >
              Hot Lead Alert
            </Button>
          </div>
        </GlassPanel>

        <GlassPanel level="primary" className="p-0 overflow-hidden">
          <iframe
            srcDoc={getEmailHtml()}
            className="w-full h-[800px] border-0"
            title="Email Preview"
          />
        </GlassPanel>
      </div>
    </div>
  );
}