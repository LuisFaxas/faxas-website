// Base email template with glass morphism design
export function baseEmailTemplate({
  title,
  content,
  ctaText,
  ctaUrl,
  footer = true,
}: {
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  footer?: boolean;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* Remove default styling */
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Mobile styles */
    @media screen and (max-width: 600px) {
      .mobile-padding { padding: 20px !important; }
      .mobile-center { text-align: center !important; }
      .container { width: 100% !important; max-width: 100% !important; }
    }

    /* Glass morphism styles */
    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* Gradient text */
    @supports (-webkit-background-clip: text) {
      .gradient-text {
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px;">
                <span class="gradient-text" style="color: #3b82f6;">FAXAS</span>
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="glass-panel" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 40px;" class="mobile-padding">
                    ${content}
                    
                    ${ctaText && ctaUrl ? `
                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                      <tr>
                        <td align="center">
                          <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${footer ? `
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 30px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} FAXAS. All rights reserved.
              </p>
              <p style="margin: 0;">
                <a href="https://faxas.net" style="color: #3b82f6; text-decoration: none;">Visit our website</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="https://faxas.net/portal" style="color: #3b82f6; text-decoration: none;">Portal Login</a>
              </p>
            </td>
          </tr>
          ` : ''}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}