import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: 'FAXAS <noreply@faxas.net>',
  replyTo: 'hello@faxas.net',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@faxas.net',
};

// Email sending function with error handling
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo = EMAIL_CONFIG.replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || subject, // Fallback to subject if no text provided
      reply_to: replyTo,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Validate email configuration
export function validateEmailConfig(): boolean {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent');
    return false;
  }
  return true;
}