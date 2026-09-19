/**
 * Send 6-digit Verification Code via Brevo (Sendinblue) Transactional Email API
 * @param {string} email Destination email address
 * @param {string} code 6-digit verification code
 */
export async function sendVerificationEmail(email, code) {
  const apiKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'manikantaraparthi71@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'THREADTALES Atelier';

  console.log(`✉️ [Brevo Service] Dispatching 6-digit verification code (${code}) to ${email}...`);

  if (!apiKey || apiKey === 'your_brevo_api_key_here') {
    console.warn('⚠️ [Brevo Service] BREVO_API_KEY is not configured in .env file.');
    console.log(`🔑 [Dev Fallback Console Log] Verification Code for ${email} is: [ ${code} ] (Valid for 60s)`);
    return {
      success: true,
      delivered: false,
      code: code,
      note: 'Brevo API key missing in .env. Code logged to server console.'
    };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: email,
            name: email.split('@')[0]
          }
        ],
        subject: `THREADTALES — Your Verification Code is ${code}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Georgia', serif; background-color: #FFFDFB; color: #301B25; padding: 20px; }
              .card { max-width: 480px; margin: 0 auto; background: #FFFFFF; border: 1px solid #F7C9D5; border-radius: 20px; padding: 32px; text-align: center; }
              .logo { font-size: 22px; font-weight: bold; letter-spacing: 0.25em; color: #70213F; margin-bottom: 6px; }
              .sub { font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #C65A7B; margin-bottom: 24px; }
              .title { font-size: 18px; font-weight: bold; color: #301B25; margin-bottom: 12px; }
              .code-box { background: #FFF7F9; border: 2px dashed #9D3158; border-radius: 14px; padding: 16px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.4em; color: #9D3158; margin: 20px 0; }
              .note { font-size: 12px; color: #70213F; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="logo">THREADTALES</div>
              <div class="sub">LUXURY CROCHET STUDIO</div>
              <div class="title">Your Atelier Sign-In Code</div>
              <p style="font-size: 13px; color: #301B25;">Please use the following 6-digit verification code to complete your sign-in:</p>
              <div class="code-box">${code}</div>
              <p class="note">⏱️ This code is valid for <strong>1 minute (60 seconds)</strong>. Do not share this code with anyone.</p>
            </div>
          </body>
          </html>
        `
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ [Brevo Service] Email successfully sent to ${email} via Brevo! MessageId: ${data.messageId}`);
      return { success: true, delivered: true, messageId: data.messageId };
    } else {
      console.error(`❌ [Brevo Service Error]:`, data);
      return { success: false, error: data.message || 'Brevo API Error' };
    }
  } catch (err) {
    console.error(`❌ [Brevo Service Exception]:`, err);
    return { success: false, error: err.message };
  }
}
