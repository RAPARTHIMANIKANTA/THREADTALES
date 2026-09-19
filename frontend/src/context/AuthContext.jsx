import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile for authenticated user
  const fetchProfile = async (userId, userEmail) => {
    try {
      // 1. Try local storage first
      const localProfStr = localStorage.getItem(`threadtales_profile_${userId}`);
      if (localProfStr) {
        setProfile(JSON.parse(localProfStr));
      }

      // 2. Try Supabase
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProf, error: insertErr } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: userEmail, full_name: userEmail.split('@')[0] }])
          .select()
          .single();

        if (!insertErr && newProf) {
          data = newProf;
        }
      }

      if (data) {
        setProfile(data);
        localStorage.setItem(`threadtales_profile_${userId}`, JSON.stringify(data));
      } else if (!localProfStr) {
        const fallbackProf = {
          id: userId,
          email: userEmail,
          full_name: userEmail.split('@')[0],
          phone: '',
          door_number: '',
          street_name: '',
          village_block: '',
          city: '',
          state: '',
          country: 'India',
          pincode: '',
          updated_at: new Date().toISOString()
        };
        setProfile(fallbackProf);
        localStorage.setItem(`threadtales_profile_${userId}`, JSON.stringify(fallbackProf));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    // Retrieve session on startup (check Supabase and localStorage)
    const initSession = async () => {
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (sbSession?.user) {
          setSession(sbSession);
          setUser(sbSession.user);
          await fetchProfile(sbSession.user.id, sbSession.user.email);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Fallback to local
      }

      const localSessStr = localStorage.getItem('threadtales_session');
      if (localSessStr) {
        try {
          const parsed = JSON.parse(localSessStr);
          if (parsed?.user) {
            setSession(parsed);
            setUser(parsed.user);
            await fetchProfile(parsed.user.id, parsed.user.email);
          }
        } catch (err) {
          localStorage.removeItem('threadtales_session');
        }
      }
      setLoading(false);
    };

    initSession();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
      if (sbSession?.user) {
        setSession(sbSession);
        setUser(sbSession.user);
        await fetchProfile(sbSession.user.id, sbSession.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Send Passwordless 6-digit OTP code via Brevo Email API (Valid for 1 minute)
  const sendEmailOtp = async (email) => {
    const cleanEmail = email.toLowerCase().trim();
    const expiresAt = Date.now() + 60 * 1000; // 60 seconds = 1 minute

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      if (data.delivered) {
        // Brevo email delivered! Clear local code so verification queries backend
        localStorage.removeItem(`threadtales_otp_${cleanEmail}`);
      } else if (data.code) {
        // Dev fallback mode if Brevo API key is not configured
        const otpRecord = { email: cleanEmail, code: data.code, createdAt: Date.now(), expiresAt: data.expiresAt || expiresAt };
        localStorage.setItem(`threadtales_otp_${cleanEmail}`, JSON.stringify(otpRecord));
      }

      return { 
        success: true, 
        delivered: data.delivered, 
        code: data.code,
        expiresAt: data.expiresAt || expiresAt, 
        email: cleanEmail 
      };
    } catch (err) {
      console.error('Backend send-otp call note:', err.message);
      // Dev local fallback if backend is unreachable
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const otpRecord = { email: cleanEmail, code, createdAt: Date.now(), expiresAt };
      localStorage.setItem(`threadtales_otp_${cleanEmail}`, JSON.stringify(otpRecord));
      return { success: true, code, expiresAt, email: cleanEmail, delivered: false };
    }
  };

  // Verify 6-digit OTP code & execute Database Profile Insertion Query
  const verifyEmailOtp = async (email, token) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.toString().trim();
    const localOtpKey = `threadtales_otp_${cleanEmail}`;
    const storedOtpStr = localStorage.getItem(localOtpKey);

    let isVerified = false;

    // 1. If local fallback record exists (dev mode without Brevo key), verify locally
    if (storedOtpStr) {
      const storedOtp = JSON.parse(storedOtpStr);
      if (Date.now() > storedOtp.expiresAt) {
        localStorage.removeItem(localOtpKey);
        throw new Error('Verification code expired! Codes are valid for 1 minute only. Please click "Resend Code".');
      }
      if (storedOtp.code === cleanToken) {
        isVerified = true;
        localStorage.removeItem(localOtpKey);
      } else {
        throw new Error('Invalid 6-digit verification code. Please check your email inbox and try again.');
      }
    } else {
      // 2. Verify directly with Backend (which sent the Brevo email code!)
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, token: cleanToken })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        isVerified = true;
      } else {
        throw new Error(data.error || 'Invalid or expired verification code. Please check your email inbox and try again.');
      }
    }

    // Create session & user object with persistent User ID
    const userId = 'usr_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    const activeUser = {
      id: userId,
      email: cleanEmail,
      user_metadata: { full_name: cleanEmail.split('@')[0] }
    };
    const activeSession = { user: activeUser, access_token: 'local_token_' + Date.now() };

    // Retrieve existing profile if available
    const existingProfStr = localStorage.getItem(`threadtales_profile_${userId}`);
    let userProfData = existingProfStr ? JSON.parse(existingProfStr) : {
      id: userId,
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0],
      phone: '',
      door_number: '',
      street_name: '',
      village_block: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('threadtales_session', JSON.stringify(activeSession));
    localStorage.setItem(`threadtales_profile_${userId}`, JSON.stringify(userProfData));
    
    setUser(activeUser);
    setSession(activeSession);
    setProfile(userProfData);

    // EXECUTE DATABASE QUERY: Store/Upsert User Details into Supabase profiles table
    try {
      const { data: dbData, error: dbErr } = await supabase
        .from('profiles')
        .upsert(userProfData, { onConflict: 'id' });

      if (dbErr) {
        console.log('Database Query Note:', dbErr.message);
      } else {
        console.log('✅ User email stored in database profiles table successfully!');
      }
    } catch (dbErr) {
      console.log('Database query exception:', dbErr.message);
    }

    return { user: activeUser, session: activeSession, profile: userProfData };
  };

  // Save / Update Detailed Structured Profile into Database
  const updateProfile = async (updates) => {
    if (!user) return;
    
    const updatedProf = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    setProfile(updatedProf);
    localStorage.setItem(`threadtales_profile_${user.id}`, JSON.stringify(updatedProf));

    // EXECUTE DATABASE UPDATE QUERY
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updatedProf, { onConflict: 'id' });

      if (error) {
        console.log('Database profile update note:', error.message);
      } else {
        console.log('✅ Structured address details stored in database successfully!');
      }
    } catch (err) {
      console.log('Supabase profile sync skipped:', err.message);
    }

    return updatedProf;
  };

  // Sign Out
  const logout = async () => {
    localStorage.removeItem('threadtales_session');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignored
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        sendEmailOtp,
        verifyEmailOtp,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
