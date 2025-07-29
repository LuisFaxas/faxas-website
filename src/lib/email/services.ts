import { sendEmail, EMAIL_CONFIG, validateEmailConfig } from './resend';
import { welcomeEmailTemplate } from './templates/welcome-email';
import { questionnaireCompleteTemplate } from './templates/questionnaire-complete';
import { LeadScoreBreakdown } from '@/types/portal';
import { getTemperatureEmoji } from '@/types/portal';

// Send welcome email when user creates portal account
export async function sendWelcomeEmail({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  if (!validateEmailConfig()) {
    console.log('Email not configured - skipping welcome email');
    return { success: true, skipped: true };
  }

  const html = welcomeEmailTemplate({ userName, userEmail });
  
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to FAXAS Portal! 🎉',
    html,
  });
}

// Send admin notification when questionnaire is completed
export async function sendQuestionnaireCompleteNotification({
  leadName,
  leadEmail,
  leadCompany,
  score,
  responses,
}: {
  leadName: string;
  leadEmail: string;
  leadCompany?: string;
  score: LeadScoreBreakdown;
  responses: { question: string; answer: string }[];
}) {
  if (!validateEmailConfig()) {
    console.log('Email not configured - skipping questionnaire notification');
    return { success: true, skipped: true };
  }

  const temperature = score.temperature;
  const temperatureEmoji = getTemperatureEmoji(temperature);
  const isHotLead = score.total >= 80;

  const html = questionnaireCompleteTemplate({
    leadName,
    leadEmail,
    leadCompany,
    score,
    temperature,
    temperatureEmoji,
    responses,
    isHotLead,
  });

  // For hot leads, send with high priority
  const subject = isHotLead 
    ? `🚨 HOT LEAD ALERT: ${leadName} - Score ${score.total}`
    : `New Lead: ${leadName} - ${temperatureEmoji} ${temperature} (${score.total})`;

  return sendEmail({
    to: EMAIL_CONFIG.adminEmail,
    subject,
    html,
  });
}

// Send hot lead alert (convenience function for 80+ scores)
export async function sendHotLeadAlert({
  leadName,
  leadEmail,
  leadCompany,
  leadPhone,
  score,
  responses,
}: {
  leadName: string;
  leadEmail: string;
  leadCompany?: string;
  leadPhone?: string;
  score: LeadScoreBreakdown;
  responses: { question: string; answer: string }[];
}) {
  if (!validateEmailConfig()) {
    console.log('Email not configured - skipping hot lead alert');
    return { success: true, skipped: true };
  }

  // Add phone to responses if available
  const enhancedResponses = [...responses];
  if (leadPhone) {
    enhancedResponses.unshift({
      question: 'Phone Number',
      answer: leadPhone,
    });
  }

  // Send the notification with hot lead flag
  return sendQuestionnaireCompleteNotification({
    leadName,
    leadEmail,
    leadCompany,
    score,
    responses: enhancedResponses,
  });
}

// Batch send function for multiple notifications
export async function sendBatchEmails(emails: Array<{
  type: 'welcome' | 'questionnaire' | 'hotlead';
  data: any;
}>) {
  if (!validateEmailConfig()) {
    console.log('Email not configured - skipping batch emails');
    return { success: true, skipped: true, results: [] };
  }

  const results = await Promise.all(
    emails.map(async ({ type, data }) => {
      switch (type) {
        case 'welcome':
          return sendWelcomeEmail(data);
        case 'questionnaire':
          return sendQuestionnaireCompleteNotification(data);
        case 'hotlead':
          return sendHotLeadAlert(data);
        default:
          return { success: false, error: 'Unknown email type' };
      }
    })
  );

  return {
    success: results.every(r => r.success),
    results,
  };
}