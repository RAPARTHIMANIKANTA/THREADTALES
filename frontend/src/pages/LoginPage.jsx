import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, KeyRound, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Clock, Inbox, Home, MapPin, User, Building, Compass, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { sendEmailOtp, verifyEmailOtp, updateProfile, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [step, setStep] = useState('EMAIL'); // 'EMAIL', 'OTP', or 'DETAILS'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Structured Address Details Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [doorNumber, setDoorNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [villageBlock, setVillageBlock] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  // 1-Minute Expiration Timer
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds (1 minute)
  const [timerExpired, setTimerExpired] = useState(false);

  // Countdown timer for 1-minute expiration
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerExpired(true);
            setErrorMsg('Verification code expired (1 minute limit). Please request a new code.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timeLeft]);

  // Where to redirect after login (default: /profile)
  const from = location.state?.from || '/profile';

  // Populate existing profile data if present
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.door_number) setDoorNumber(profile.door_number);
      if (profile.street_name) setStreetName(profile.street_name);
      if (profile.village_block) setVillageBlock(profile.village_block);
      if (profile.city) setCity(profile.city);
      if (profile.state) setStateName(profile.state);
      if (profile.country) setCountry(profile.country);
      if (profile.pincode) setPincode(profile.pincode);
    }
  }, [profile]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setTimerExpired(false);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendEmailOtp(email);
      setTimeLeft(60);
      setStep('OTP');
      setSuccessMsg(`6-digit verification code dispatched to ${email} via Brevo. Check your email inbox!`);
    } catch (err) {
      console.error('OTP send error:', err);
      setErrorMsg(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (timerExpired) {
      setErrorMsg('This code has expired (valid for 1 minute). Click "Resend Code" below to receive a new code in your email.');
      return;
    }

    if (!otpToken || otpToken.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp(email, otpToken);
      // Move to Step 3 (Structured Details Onboarding)
      setStep('DETAILS');
      setErrorMsg('');
      setSuccessMsg('Email verified! Personalize your VIP Atelier delivery profile below.');
    } catch (err) {
      console.error('OTP verify error:', err);
      setErrorMsg(err.message || 'Invalid or expired verification code. Please check your email inbox and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim()
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error('Save details error:', err);
      setErrorMsg(err.message || 'Failed to save profile details into database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillSample = () => {
    setFullName('Manikanta Raparthi');
    setPhone('+91 98765 43210');
    setErrorMsg('');
  };

  return (
    <div className="relative pt-28 pb-24 px-4 sm:px-8 max-w-xl mx-auto space-y-8">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#F7C9D5]/30 to-[#9D3158]/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#70213F]/5 blur-2xl rounded-full -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D3158] animate-pulse" />
          <span className="font-serif text-[11px] font-bold tracking-[0.25em] text-[#70213F] uppercase">
            {step === 'DETAILS' ? 'MEMBER PROFILE' : 'ATELIER SIGN-IN'}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25] tracking-tight">
          {step === 'DETAILS' ? 'Complete Member Profile' : 'Welcome to THREADTALES'}
        </h1>

        <p className="text-xs sm:text-sm text-[#301B25]/75 max-w-md mx-auto leading-relaxed">
          {step === 'DETAILS' 
            ? 'Enter your name and phone number below to save your profile into the database.' 
            : 'Enter your email address to receive a passwordless 6-digit verification code directly in your email inbox.'
          }
        </p>

        <div className="flex items-center justify-center space-x-2 pt-1">
          <div className="w-8 h-0.5 bg-[#F7C9D5] rounded-full"></div>
          <div className="w-3 h-1 bg-[#9D3158] rounded-full"></div>
          <div className="w-8 h-0.5 bg-[#F7C9D5] rounded-full"></div>
        </div>
      </div>

      {/* Main Login / Onboarding Card */}
      <div className="bg-[#FFFDFB]/95 backdrop-blur-md p-6 sm:p-9 rounded-3xl border border-[#F7C9D5]/80 shadow-2xl shadow-[#9D3158]/10 space-y-7 relative overflow-hidden">
        
        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 gap-2 border-b border-[#F7C9D5]/40 pb-5 text-[10px] font-bold tracking-wider uppercase">
          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${step === 'EMAIL' ? 'bg-[#FFF7F9] text-[#9D3158] border border-[#F7C9D5]' : 'text-emerald-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'EMAIL' ? 'bg-[#9D3158] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              {step !== 'EMAIL' ? '✓' : '1'}
            </span>
            <span className="truncate">1. Email</span>
          </div>

          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${step === 'OTP' ? 'bg-[#FFF7F9] text-[#9D3158] border border-[#F7C9D5]' : step === 'DETAILS' ? 'text-emerald-700' : 'text-[#301B25]/40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'OTP' ? 'bg-[#9D3158] text-white' : step === 'DETAILS' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F7C9D5]/40'}`}>
              {step === 'DETAILS' ? '✓' : '2'}
            </span>
            <span className="truncate">2. Brevo OTP</span>
          </div>

          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${step === 'DETAILS' ? 'bg-[#FFF7F9] text-[#9D3158] border border-[#F7C9D5]' : 'text-[#301B25]/40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'DETAILS' ? 'bg-[#9D3158] text-white' : 'bg-[#F7C9D5]/40'}`}>
              3
            </span>
            <span className="truncate">3. Profile DB</span>
          </div>
        </div>

        {/* Single Clean Notification Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-900 text-xs flex items-start space-x-3 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-0.5">
              <p className="font-bold text-rose-900">Verification Alert</p>
              <p className="text-rose-800/90">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && !errorMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-3 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-900">Database Status</p>
              <p className="text-emerald-800/90">{successMsg}</p>
            </div>
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#301B25] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D3158]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158] transition-all"
                />
              </div>
              <p className="text-[11px] text-[#301B25]/60 italic">
                A passwordless 6-digit OTP code will be generated and dispatched via Brevo API.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#70213F] via-[#9D3158] to-[#852749] hover:opacity-95 text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <span>DISPATCHING BREVO EMAIL...</span>
              ) : (
                <>
                  <span>SEND VERIFICATION CODE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: BREVO OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            
            {/* Brevo Email Dispatch Box */}
            <div className="p-4 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#70213F] flex items-center space-x-1.5">
                  <Inbox className="w-4 h-4 text-[#9D3158]" />
                  <span>BREVO SMTP DISPATCH</span>
                </span>
                <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full flex items-center space-x-1.5 ${
                  timeLeft <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-[#F7C9D5] text-[#70213F]'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </span>
              </div>

              <p className="text-xs text-[#301B25] font-medium leading-relaxed">
                Sent 6-digit code to <strong className="text-[#9D3158]">{email}</strong>.
              </p>
              <div className="w-full bg-[#F7C9D5]/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#9D3158] h-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#301B25] block">
                  Enter 6-Digit Code
                </label>
                <button
                  type="button"
                  onClick={() => { setStep('EMAIL'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[11px] font-semibold text-[#9D3158] hover:underline"
                >
                  Change Email
                </button>
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D3158]" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  disabled={timerExpired}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.trim())}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-base font-bold tracking-[0.4em] text-[#301B25] text-center focus:outline-none focus:ring-2 focus:ring-[#9D3158] disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || timerExpired}
              className="w-full py-4 bg-gradient-to-r from-[#70213F] via-[#9D3158] to-[#852749] hover:opacity-95 text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <span>VERIFYING CODE...</span>
              ) : (
                <>
                  <span>VERIFY & CONTINUE</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            {timerExpired && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 text-xs font-bold text-[#9D3158] hover:underline uppercase tracking-wider text-center block"
              >
                🔄 RESEND NEW EMAIL CODE
              </button>
            )}
          </form>
        )}

        {/* STEP 3: STREAMLINED MEMBER PROFILE (NAME & PHONE ONLY) */}
        {step === 'DETAILS' && (
          <form onSubmit={handleSaveDetails} className="space-y-6 animate-in fade-in duration-300">
            
            {/* Live Interactive VIP Passport Card */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#70213F] via-[#9D3158] to-[#4A1428] text-white shadow-xl space-y-4 border border-white/20 overflow-hidden">
              
              {/* Metallic Card Shimmer Layer */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#F7C9D5]" />
                  <span className="font-serif text-xs font-bold tracking-[0.25em] text-[#F7C9D5] uppercase">
                    THREADTALES VIP PASSPORT
                  </span>
                </div>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 text-[10px] font-bold border border-emerald-400/40 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DATABASE VERIFIED</span>
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <h4 className="font-serif font-bold text-xl tracking-wide text-white">
                  {fullName || email.split('@')[0] || 'Atelier VIP Member'}
                </h4>
                <p className="text-xs text-[#F7C9D5]/90 font-medium flex items-center space-x-2">
                  <span>{phone || '+91 Contact Phone'}</span>
                  <span>•</span>
                  <span className="underline decoration-[#F7C9D5]/40">{email}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-white/15 text-[11px] text-white/80 flex items-center justify-between">
                <span className="font-medium text-[#F7C9D5]">Member Account Status:</span>
                <span className="font-mono text-[10px] text-white/90">ID: {user?.id ? `${user.id.slice(0, 14)}...` : 'USR_RECORD'}</span>
              </div>
            </div>

            {/* Form Section Header & Auto-Fill */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#301B25] flex items-center space-x-1.5">
                <User className="w-4 h-4 text-[#9D3158]" />
                <span>Personal Member Details</span>
              </span>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="text-[11px] font-bold text-[#9D3158] hover:text-[#70213F] hover:bg-[#F7C9D5]/50 flex items-center space-x-1 bg-[#FFF7F9] px-3 py-1.5 rounded-full border border-[#F7C9D5] transition-all shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 fill-[#9D3158]" />
                <span>Sample Details</span>
              </button>
            </div>

            {/* Streamlined Personal Inputs: Full Name & Phone Number */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#301B25] block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D3158]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Manikanta Raparthi"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#301B25] block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D3158]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Save to Database Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#70213F] via-[#9D3158] to-[#852749] hover:opacity-95 text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-4"
            >
              {loading ? (
                <span>SAVING TO DATABASE...</span>
              ) : (
                <>
                  <span>SAVE TO DATABASE & ENTER ATELIER</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
