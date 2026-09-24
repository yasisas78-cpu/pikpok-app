import React, { useState } from 'react';
import { ArrowRight, CheckCircle, LogIn, Mail, ShoppingBag, Store, X } from 'lucide-react';
import { AuthUser, Language, UserRole } from '../types';
import { translations } from '../data/translations';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  lang: Language;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, lang, initialMode = 'signup' }) => {
  const t = translations[lang];
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const buildAuthUser = (user: { id: string; email?: string | null; phone?: string | null; user_metadata?: Record<string, unknown> }): AuthUser => {
    const metadataName = typeof user.user_metadata?.username === 'string'
      ? user.user_metadata.username
      : typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '';
    const metadataRole = user.user_metadata?.role === 'seller' ? 'seller' : selectedRole;
    return {
      id: user.id,
      name: typeof user.user_metadata?.display_name === 'string' ? user.user_metadata.display_name : metadataName || user.email?.split('@')[0] || user.phone || 'PikPok User',
      username: metadataName || user.email?.split('@')[0] || user.phone || 'pikpokuser',
      bio: typeof user.user_metadata?.bio === 'string' ? user.user_metadata.bio : '',
      emailOrPhone: user.email || user.phone || email.trim(),
      avatar: typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      role: metadataRole,
      method: 'email'
    };
  };

  const completeDemoAuth = (method: 'email' | 'google') => {
    const identifier = email.trim() || 'demo@pikpok.local';
    onLoginSuccess({
      id: `demo_${identifier.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
      name: displayName.trim() || username.trim() || identifier.split('@')[0] || 'Demo User',
      username: username.trim() || identifier.split('@')[0] || 'demo',
      bio: bio.trim(),
      emailOrPhone: identifier,
      avatar: avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      role: selectedRole,
      method
    });
    onClose();
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase || !isSupabaseConfigured) {
      completeDemoAuth('email');
      return;
    }

    setIsSubmitting(true);
    const identifier = email.trim();
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email: identifier, password, options: { data: { username: username.trim(), display_name: displayName.trim(), phone: phone.trim() || null, bio: bio.trim(), avatar_url: avatarPreview || null, role: selectedRole } } })
      : await supabase.auth.signInWithPassword({ email: identifier, password });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      setMessage('Check your email to confirm your account, then sign in.');
      setMode('login');
      return;
    }

    if (result.data.user) {
      onLoginSuccess(buildAuthUser(result.data.user));
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    if (!supabase || !isSupabaseConfigured) {
      completeDemoAuth('google');
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    setIsSubmitting(false);
    if (signInError) setError(signInError.message);
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar">
        <button id="auth-modal-close-btn" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-2 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 mx-auto flex items-center justify-center font-black text-white text-xl shadow-lg shadow-pink-600/30 mb-3">P</div>
          <h2 className="text-xl font-extrabold tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create your PikPok account'}</h2>
          <p className="text-xs text-neutral-400 mt-1 px-4 leading-relaxed">{t.loginSignupSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 mb-5 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
          <button type="button" onClick={() => switchMode('login')} className={`py-2 rounded-lg text-xs font-bold ${mode === 'login' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}>Log in</button>
          <button type="button" onClick={() => switchMode('signup')} className={`py-2 rounded-lg text-xs font-bold ${mode === 'signup' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}>Sign up</button>
        </div>

        {mode === 'signup' && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Account type</label>
            <div className="grid grid-cols-2 gap-2">
              {([['buyer', ShoppingBag, t.roleBuyerTitle], ['seller', Store, t.roleSellerTitle]] as const).map(([role, Icon, label]) => (
                <button key={role} type="button" onClick={() => setSelectedRole(role)} className={`p-3 rounded-xl border text-left flex items-center gap-2 ${selectedRole === role ? 'bg-pink-950/40 border-pink-500' : 'bg-neutral-800/60 border-neutral-700/60'}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold">{label}</span>
                  {selectedRole === role && <CheckCircle className="w-3.5 h-3.5 ml-auto text-pink-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="button" onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50">
          <span className="font-black text-base">G</span>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-neutral-800" />
          <span className="flex-shrink mx-3 text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">or with email / phone</span>
          <div className="flex-grow border-t border-neutral-800" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address (required)" className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500" />
          {mode === 'signup' && <>
            <input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500" />
            <input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500" />
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number (optional)" className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500" />
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio (optional)" className="min-h-16 w-full rounded-xl border border-neutral-700 bg-neutral-800/90 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-pink-500 focus:outline-none" />
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-700 px-3.5 py-2.5 text-xs text-neutral-400 hover:border-pink-500"><span>{avatarPreview ? 'Profile picture selected' : 'Upload profile picture (optional)'}</span><input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setAvatarPreview(String(reader.result)); reader.readAsDataURL(file); }} /></label>
          </>}
          <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (minimum 6 characters)" className="w-full px-3.5 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500" />
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
          {message && <p className="text-[11px] text-emerald-400">{message}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50">
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-neutral-800/80 text-center">
          <p className="text-[10px] text-neutral-500 flex items-center justify-center gap-1"><Mail className="w-3 h-3 text-emerald-500" />{isSupabaseConfigured ? 'Secure authentication powered by Supabase' : 'Local demo mode - no Supabase keys required'}</p>
        </div>
      </div>
    </div>
  );
};
