import { baseEmailTemplate } from './base-template';

export function welcomeEmailTemplate({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: #111827;">
      Welcome to FAXAS Portal! 🎉
    </h2>
    
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
      Hi ${userName || 'there'},
    </p>
    
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
      Thank you for creating your FAXAS Portal account! We're excited to help you transform your digital presence.
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); border-radius: 16px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">
        Your Next Steps:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
        <li style="margin-bottom: 12px; line-height: 1.5;">
          <strong>Complete the Questionnaire</strong><br/>
          Tell us about your project needs (takes ~5 minutes)
        </li>
        <li style="margin-bottom: 12px; line-height: 1.5;">
          <strong>Get Your Score</strong><br/>
          Receive personalized recommendations based on your responses
        </li>
        <li style="margin-bottom: 12px; line-height: 1.5;">
          <strong>Access Resources</strong><br/>
          Download guides and tools tailored to your needs
        </li>
      </ul>
    </div>
    
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        <strong>Your Account Details:</strong><br/>
        Email: ${userEmail}<br/>
        Portal Access: <a href="https://faxas.net/portal/dashboard" style="color: #3b82f6; text-decoration: none;">https://faxas.net/portal/dashboard</a>
      </p>
    </div>
    
    <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
      If you have any questions, feel free to reply to this email. We're here to help!
    </p>
    
    <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
      Best regards,<br/>
      <strong>The FAXAS Team</strong>
    </p>
  `;

  return baseEmailTemplate({
    title: 'Welcome to FAXAS Portal',
    content,
    ctaText: 'Start Questionnaire',
    ctaUrl: 'https://faxas.net/portal/questionnaire',
  });
}