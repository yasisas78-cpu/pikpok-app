import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  Store,
  RefreshCw
} from 'lucide-react';
import { Language, UserRole, AuthUser } from '../types';
import { translations } from '../data/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang
}) => {
  const t = translations[lang];

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [nameInput, setNameInput] = useState<string>('');
  const [phoneOrEmailInput, setPhoneOrEmailInput] = useState<string>('');
  
  // Simulated OTP state
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle Google OAuth Simulation
  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const googleUser: AuthUser = {
        id: `usr_${Date.now()}`,
        name: nameInput.trim() || 'Ayesha Khan',
        emailOrPhone: 'ayesha.khan@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        role: selectedRole,
        method: 'google'
      };
      onLoginSuccess(googleUser);
      onClose();
    }, 600);
  };

  // Submit phone or email to receive simulated OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmailInput.trim()) return;

    if (authMode === 'phone') {
      // Pre-fill simulated OTP 1234 for best user testing experience
      setIsOtpStep(true);
      setOtpDigits(['1', '2', '3', '4']);
    } else {
      // Email signup directly or with code
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const emailUser: AuthUser = {
          id: `usr_${Date.now()}`,
          name: nameInput.trim() || (selectedRole === 'seller' ? 'Karachi Electronics Hub' : 'Hamza Ali'),
          emailOrPhone: phoneOrEmailInput.trim(),
          avatar: selectedRole === 'seller'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          role: selectedRole,
          method: 'email'
        };
        onLoginSuccess(emailUser);
        onClose();
      }, 500);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);
    setOtpError(null);

    // auto focus next input if digit entered
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 4) {
      setOtpError(t.otpError);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const phoneUser: AuthUser = {
        id: `usr_${Date.now()}`,
        name: nameInput.trim() || (selectedRole === 'seller' ? 'Lahore Gadgets Store' : 'Zainab Ahmed'),
        emailOrPhone: phoneOrEmailInput.trim(),
        avatar: selectedRole === 'seller'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
          : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        role: selectedRole,
        method: 'phone'
      };
      onLoginSuccess(phoneUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mt-2 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 mx-auto flex items-center justify-center font-black text-white text-xl shadow-lg shadow-pink-600/30 mb-3">
            P
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {t.loginSignupTitle}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 px-4 leading-relaxed">
            {t.loginSignupSub}
          </p>
        </div>

        {/* Role Selection (Buyer vs Seller) */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
            {t.selectRoleTitle}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              id="auth-role-buyer-btn"
              onClick={() => setSelectedRole('buyer')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedRole === 'buyer'
                  ? 'bg-pink-950/40 border-pink-500 text-white shadow-md shadow-pink-500/10'
                  : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ShoppingBag className={`w-4 h-4 ${selectedRole === 'buyer' ? 'text-pink-400' : 'text-neutral-500'}`} />
                {selectedRole === 'buyer' && (
                  <CheckCircle className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t.roleBuyerTitle}</p>
                <p className="text-[10px] text-neutral-400 leading-tight mt-0.5 line-clamp-2">
                  {t.roleBuyerDesc}
                </p>
              </div>
            </button>

            <button
              type="button"
              id="auth-role-seller-btn"
              onClick={() => setSelectedRole('seller')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedRole === 'seller'
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-md shadow-amber-500/10'
                  : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Store className={`w-4 h-4 ${selectedRole === 'seller' ? 'text-amber-400' : 'text-neutral-500'}`} />
                {selectedRole === 'seller' && (
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t.roleSellerTitle}</p>
                <p className="text-[10px] text-neutral-400 leading-tight mt-0.5 line-clamp-2">
                  {t.roleSellerDesc}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 1: Main Login Options */}
        {!isOtpStep ? (
          <div>
            {/* Option 1: Google Sign In Button */}
            <button
              id="auth-google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2.5 transition active:scale-98 shadow-md mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.signInWithGoogle}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                or with phone / email
              </span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            {/* Option 2: Phone vs Email Sub Tabs */}
            <div className="flex rounded-xl bg-neutral-800/80 p-1 mb-4 border border-neutral-700/50">
              <button
                type="button"
                id="auth-tab-phone"
                onClick={() => setAuthMode('phone')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  authMode === 'phone' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.phoneEmailTabPhone}</span>
              </button>
              <button
                type="button"
                id="auth-tab-email"
                onClick={() => setAuthMode('email')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  authMode === 'email' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.phoneEmailTabEmail}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  {t.fullNameLabel}
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={t.fullNameInputPlaceholder}
                  className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              {authMode === 'phone' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    {t.phoneNumberLabel}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-neutral-400">🇵🇰 +92</span>
                    <input
                      id="auth-phone-input"
                      type="tel"
                      required
                      value={phoneOrEmailInput}
                      onChange={(e) => setPhoneOrEmailInput(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full pl-16 pr-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    {t.emailAddressLabel}
                  </label>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={phoneOrEmailInput}
                    onChange={(e) => setPhoneOrEmailInput(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center space-x-2 transition active:scale-98"
              >
                <span>{authMode === 'phone' ? t.sendOtpBtn : t.signInBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Simulated OTP Verification Step */
          <div className="py-2 text-center">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {t.verifyOtpTitle}
            </h3>
            <p className="text-xs text-neutral-400 mb-4 px-2">
              {t.verifyOtpSub}{' '}
              <span className="text-pink-400 font-bold">
                {phoneOrEmailInput || '+92 300 1234567'}
              </span>
            </p>

            {/* 4 Digit OTP Inputs */}
            <div className="flex justify-center space-x-3 mb-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 bg-neutral-800 border-2 border-neutral-700 focus:border-pink-500 rounded-2xl text-center text-lg font-black text-white focus:outline-none transition shadow-inner"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-[11px] text-rose-400 mb-3">{otpError}</p>
            )}

            <div className="flex items-center justify-between px-2 mb-4 text-xs text-neutral-400">
              <span className="text-[11px]">Simulated OTP: 1234</span>
              <button
                type="button"
                onClick={() => setOtpDigits(['1', '2', '3', '4'])}
                className="text-pink-400 hover:text-pink-300 font-bold text-[11px] flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t.resendOtp}</span>
              </button>
            </div>

            <button
              type="button"
              id="auth-verify-otp-btn"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center space-x-2 transition active:scale-98"
            >
              <span>{t.verifyAndContinue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsOtpStep(false)}
              className="mt-3 text-xs text-neutral-400 hover:text-white transition"
            >
              ← Change Phone Number
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-neutral-800/80 text-center">
          <p className="text-[10px] text-neutral-500 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Secure Pakistani Shopping & Seller Verification Guarantee</span>
          </p>
        </div>
      </div>
    </div>
  );
};
