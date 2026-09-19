import { supabase } from '../config/supabase.js';
import { sendVerificationEmail } from '../services/brevoService.js';

// In-memory store for 6-digit OTP codes with 1-minute expiration
const localOtpStore = new Map(); // email -> { code, expiresAt }

// Send Passwordless Email 6-Digit OTP via Brevo API (Valid for 1 minute)
export async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 60 * 1000; // Exactly 60 seconds (1 minute)

    // Store in memory
    localOtpStore.set(cleanEmail, { code, expiresAt });

    // Send 6-digit code to user's real email address via Brevo API
    const emailResult = await sendVerificationEmail(cleanEmail, code);

    return res.json({ 
      success: true, 
      expiresAt,
      delivered: emailResult.delivered,
      code: emailResult.delivered ? undefined : code,
      message: emailResult.delivered 
        ? `6-digit verification code sent directly to ${cleanEmail}. Valid for 60 seconds.`
        : `Verification code generated for ${cleanEmail}. Check server console if Brevo API key is not set.`
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(400).json({ error: err.message || 'Failed to send verification code' });
  }
}

// Verify OTP Token Code & Execute Database Profile Insertion Query
export async function verifyOtp(req, res) {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.toString().trim();
    const storedRecord = localOtpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({ error: 'No active verification code found for this email. Please request a new code.' });
    }

    // Check expiration (1 minute = 60,000 ms)
    if (Date.now() > storedRecord.expiresAt) {
      localOtpStore.delete(cleanEmail);
      return res.status(400).json({ error: 'Verification code expired! Codes are valid for 1 minute only. Please request a new code.' });
    }

    // Check token match
    if (storedRecord.code !== cleanToken) {
      return res.status(400).json({ error: 'Invalid 6-digit verification code. Please check your email inbox and try again.' });
    }

    // Code verified successfully! Clear stored OTP
    localOtpStore.delete(cleanEmail);

    // Generate persistent user ID
    const userId = 'usr_' + Buffer.from(cleanEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    const mockUser = {
      id: userId,
      email: cleanEmail,
      user_metadata: { full_name: cleanEmail.split('@')[0] }
    };
    const mockSession = { user: mockUser, access_token: 'local_token_' + Date.now() };

    // EXECUTE DATABASE QUERY: Insert / Upsert user profile into Supabase profiles table
    try {
      const { data: dbProf, error: dbErr } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: cleanEmail,
          full_name: cleanEmail.split('@')[0],
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (dbErr) {
        console.log('Database query notice (profiles table):', dbErr.message);
      } else {
        console.log('✅ User email stored in database profiles table successfully!');
      }
    } catch (e) {
      console.log('Database query exception:', e.message);
    }

    return res.json({
      success: true,
      user: mockUser,
      session: mockSession
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(400).json({ error: err.message || 'Invalid or expired verification code' });
  }
}

// Get Authenticated User Profile
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return res.json({ success: true, profile: data || null });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// Update User Profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, phone } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, phone, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, profile: data });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
}
