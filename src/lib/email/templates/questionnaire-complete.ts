import { baseEmailTemplate } from './base-template';
import { LeadScoreBreakdown } from '@/types/portal';

export function questionnaireCompleteTemplate({
  leadName,
  leadEmail,
  leadCompany,
  score,
  temperature,
  temperatureEmoji,
  responses,
  isHotLead,
}: {
  leadName: string;
  leadEmail: string;
  leadCompany?: string;
  score: LeadScoreBreakdown;
  temperature: string;
  temperatureEmoji: string;
  responses: { question: string; answer: string }[];
  isHotLead: boolean;
}) {
  const urgencyStyle = isHotLead 
    ? 'background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); color: white;' 
    : 'background: #f3f4f6; color: #1f2937;';

  const content = `
    <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: #111827;">
      ${isHotLead ? '🚨 Hot Lead Alert!' : 'New Lead Questionnaire Completed'}
    </h2>
    
    ${isHotLead ? `
    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #dc2626;">
        ⚡ Immediate Action Required - Contact within 5 minutes!
      </p>
    </div>
    ` : ''}
    
    <!-- Lead Info Card -->
    <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">
        Lead Information
      </h3>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${leadName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Email:</td>
          <td style="padding: 8px 0; color: #1f2937;">
            <a href="mailto:${leadEmail}" style="color: #3b82f6; text-decoration: none;">${leadEmail}</a>
          </td>
        </tr>
        ${leadCompany ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Company:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${leadCompany}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <!-- Score Card -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="${urgencyStyle} display: inline-block; border-radius: 16px; padding: 24px 48px;">
        <p style="margin: 0 0 8px 0; font-size: 48px; font-weight: 800;">
          ${score.total}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 24px;">
          ${temperatureEmoji} ${temperature}
        </p>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          Lead Score
        </p>
      </div>
    </div>
    
    <!-- Score Breakdown -->
    <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
        Score Breakdown
      </h3>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Budget (35 pts):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1f2937;">${score.budget}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Timeline (25 pts):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1f2937;">${score.timeline}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Authority (15 pts):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1f2937;">${score.authority}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Complexity (15 pts):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1f2937;">${score.complexity}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Engagement (10 pts):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1f2937;">${score.engagement}</td>
        </tr>
      </table>
    </div>
    
    <!-- Key Responses -->
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
        Key Responses
      </h3>
      ${responses.slice(0, 5).map(r => `
        <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6;">
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">${r.question}</p>
          <p style="margin: 0; font-size: 16px; font-weight: 500; color: #1f2937;">${r.answer}</p>
        </div>
      `).join('')}
    </div>
    
    ${isHotLead ? `
    <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 16px; text-align: center;">
      <p style="margin: 0; font-size: 16px; color: #92400e;">
        <strong>📞 Call immediately!</strong> This lead is ready to move forward.
      </p>
    </div>
    ` : ''}
  `;

  return baseEmailTemplate({
    title: isHotLead ? 'Hot Lead Alert - Immediate Action Required' : 'New Lead Questionnaire Completed',
    content,
    ctaText: 'View in Admin',
    ctaUrl: 'https://faxas.net/admin/leads',
  });
}